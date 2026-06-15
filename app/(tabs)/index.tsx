import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

import { MipymePreview, MipymeCategoria } from '../../src/types/mipyme.types';
import MapPin from '../../src/components/MapPin';
import SearchBar from '../../src/components/SearchBar';
import CategoryChip from '../../src/components/ui/CategoryChip';
import EmptyState from '../../src/components/ui/EmptyState';
import { Colors, Spacing, Sizes, Typography } from '../../src/theme/theme';
import { useMipymes, useBuscarMipymes } from '../../src/hooks/useMipymes';
import MipymeBottomSheet from '../../src/components/MipymeBottomSheet';
import { useTabBarStore } from '../../src/stores/useTabBarStore';
import ErrorView from '../../src/components/ui/ErrorView';

const HABANA_REGION = {
  latitude:       23.1330,
  longitude:     -82.3700,
  latitudeDelta:   0.035,
  longitudeDelta:  0.035,
};

const CATEGORIAS_FILTRO: Array<MipymeCategoria | 'todos'> = [
  'todos', 'bodega', 'cafeteria', 'restaurante',
  'farmacia', 'panaderia', 'tienda', 'peluqueria', 'mecanico',
];

export default function MainMapScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedMipyme, setSelectedMipyme] = useState<MipymePreview | null>(null);
  const [selectedId, setSelectedId]         = useState<string | null>(null);
  const [searchText, setSearchText]             = useState('');
  const [categoriaActiva, setCategoriaActiva]   = useState<MipymeCategoria | 'todos'>('todos');
  const { hideTabBar, showTabBar } = useTabBarStore();

  // Datos desde Supabase
  const { data: mipymesData, isLoading, isError, refetch } = useMipymes(
    categoriaActiva === 'todos' ? undefined : categoriaActiva
  );
  const { data: resultadosBusqueda } = useBuscarMipymes(searchText);

  // Si hay búsqueda activa usar esos resultados, si no las del mapa
  const mipymesMostradas = useMemo(() => {
    if (searchText.trim().length >= 2) return resultadosBusqueda ?? [];
    return mipymesData ?? [];
  }, [searchText, mipymesData, resultadosBusqueda]);

  const handleMarkerPress = useCallback((mipyme: MipymePreview) => {
    setSelectedMipyme(mipyme);
    setSelectedId(mipyme.id);
    hideTabBar();
    mapRef.current?.animateToRegion(
      {
        latitude:      mipyme.lat - 0.006,
        longitude:     mipyme.lng,
        latitudeDelta:  0.020,
        longitudeDelta: 0.020,
      },
      350
    );
  }, [hideTabBar]);

  const handleCloseCard = useCallback(() => {
    setSelectedMipyme(null);
    setSelectedId(null);
    showTabBar();
  }, [showTabBar]);
  const handleClearSearch = useCallback(() => setSearchText(''), []);

  const handleCenterHabana = useCallback(() => {
    mapRef.current?.animateToRegion(HABANA_REGION, 400);
    setSelectedMipyme(null);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* MAPA */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={HABANA_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        rotateEnabled={false}
        toolbarEnabled={false}
      >
        {mipymesMostradas.map((mipyme) => (
          <Marker
            key={mipyme.id}
            coordinate={{ latitude: mipyme.lat, longitude: mipyme.lng }}
            onPress={() => handleMarkerPress(mipyme)}
            tracksViewChanges={false}
          >
            <MapPin
              categoria={mipyme.categoria}
              selected={selectedMipyme?.id === mipyme.id}
            />
          </Marker>
        ))}
      </MapView>

      {/* OVERLAY SUPERIOR */}
      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={handleClearSearch}
          placeholder="Buscar mipymes en La Habana..."
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          style={styles.chipsScroll}
        >
          {CATEGORIAS_FILTRO.map((cat) => (
            <CategoryChip
              key={cat}
              categoria={cat}
              selected={categoriaActiva === cat}
              onPress={() => {
                setCategoriaActiva(cat);
                setSelectedMipyme(null);
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* ESTADO DE CARGA */}
      {isLoading && (
        <View style={styles.loadingBadge}>
          <ActivityIndicator size="small" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Cargando mipymes...</Text>
        </View>
      )}

      {/* ESTADO DE ERROR */}
      {isError && (
        <View style={styles.errorBadgeContainer}>
          <ErrorView
            compact
            title="Error de conexión"
            onRetry={() => refetch()}
          />
        </View>
      )}

      {/* EMPTY STATE — sin resultados */}
      {!isLoading && !isError && mipymesMostradas.length === 0 && (
        <View style={styles.emptyContainer}>
          <EmptyState
            compact
            icon="search"
            title={
              searchText.trim().length >= 2
                ? 'Sin resultados'
                : 'Sin mipymes en esta categoría'
            }
            subtitle={
              searchText.trim().length >= 2
                ? `No encontramos mipymes para "${searchText}"`
                : 'Prueba seleccionando otra categoría'
            }
            actionLabel={searchText.trim().length >= 2 ? 'Limpiar búsqueda' : undefined}
            onAction={searchText.trim().length >= 2 ? handleClearSearch : undefined}
          />
        </View>
      )}

      {/* BOTÓN CENTRAR */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={handleCenterHabana}
        activeOpacity={0.85}
      >
        <Feather name="navigation" size={20} color={Colors.primary[500]} />
      </TouchableOpacity>

      {/* CARD MIPYME SELECCIONADA */}
      {selectedMipyme && (
        <SafeAreaView edges={['bottom']} style={styles.cardContainer} pointerEvents="box-none">
          {/* BOTTOM SHEET */}
          <MipymeBottomSheet
            mipymeId={selectedId}
            onClose={handleCloseCard}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.mapBackground,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing['3'],
    gap: Spacing['2'],
  },
  chipsScroll: {
    marginTop: Spacing['1'],
  },
  chipsContainer: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing['2'],
    paddingBottom: Spacing['1'],
  },
  loadingBadge: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: Typography.size.sm,
    color: Colors.neutral[700],
  },
  errorBadgeContainer: {
    position:  'absolute',
    top:       140,
    left:      Spacing.screenPadding,
    right:     Spacing.screenPadding,
    alignItems: 'center',
  },
  emptyContainer: {
    position:   'absolute',
    bottom:     120,
    left:       Spacing.screenPadding,
    right:      Spacing.screenPadding,
    alignItems: 'center',
  },
  centerButton: {
    position: 'absolute',
    right: Spacing.screenPadding,
    bottom: 104,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 100,
  },
});