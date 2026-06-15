import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import { useSavedStore, SavedStore } from '../../src/stores/useSavedStore';
import { getMipymeById } from '../../src/services/api';
import { CATEGORIAS } from '../../src/types/mipyme.types';
import { Mipyme } from '../../src/types/mipyme.types';
import { Colors, Typography, Spacing, Radius, Shadows, Sizes } from '../../src/theme/theme';

// ─────────────────────────────────────────
// SKELETON DE TARJETA
// ─────────────────────────────────────────
function SkeletonBox({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}) {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: Colors.neutral[200],
        opacity,
      }}
    />
  );
}

function SavedCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      {/* Imagen */}
      <SkeletonBox width={88} height={88} borderRadius={0} />

      {/* Info */}
      <View style={skeletonStyles.info}>
        <SkeletonBox width={70}  height={14} borderRadius={10} />
        <SkeletonBox width={140} height={18} borderRadius={6}  />
        <SkeletonBox width={110} height={13} borderRadius={6}  />
        <SkeletonBox width={80}  height={12} borderRadius={6}  />
      </View>

      {/* Botón derecho */}
      <View style={skeletonStyles.btn}>
        <SkeletonBox width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    backgroundColor: Colors.neutral[0],
    borderRadius:    Radius.lg,
    overflow:        'hidden',
    alignItems:      'center',
    ...Shadows.sm,
  },
  info: {
    flex:    1,
    padding: Spacing['3'],
    gap:     6,
  },
  btn: {
    width:          Sizes.touchTarget,
    height:         Sizes.touchTarget,
    alignItems:     'center',
    justifyContent: 'center',
    paddingRight:   Spacing['2'],
  },
});

// ─────────────────────────────────────────
// TARJETA DE MIPYME GUARDADA
// ─────────────────────────────────────────
interface SavedCardProps {
  mipyme:   Mipyme;
  onRemove: (id: string) => void;
  onPress:  (id: string) => void;
}

function SavedCard({ mipyme, onRemove, onPress }: SavedCardProps) {
  const categoriaConfig = CATEGORIAS[mipyme.categoria];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(mipyme.id)}
      activeOpacity={0.85}
    >
      <View style={styles.cardImage}>
        {mipyme.imagen_portada ? (
          <Image
            source={{ uri: mipyme.imagen_portada }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImagePlaceholder, { backgroundColor: categoriaConfig.color }]}>
            <Feather name={categoriaConfig.icon as any} size={28} color={Colors.neutral[0]} />
          </View>
        )}
      </View>

      <View style={styles.cardInfo}>
        <View style={[
          styles.categoriaBadge,
          { backgroundColor: categoriaConfig.color + '18' },
        ]}>
          <Feather name={categoriaConfig.icon as any} size={10} color={categoriaConfig.color} />
          <Text style={[styles.categoriaText, { color: categoriaConfig.color }]}>
            {categoriaConfig.label}
          </Text>
        </View>

        <Text style={styles.cardNombre} numberOfLines={1}>{mipyme.nombre}</Text>

        <View style={styles.cardDireccionRow}>
          <Feather name="map-pin" size={12} color={Colors.neutral[400]} />
          <Text style={styles.cardDireccion} numberOfLines={1}>{mipyme.direccion}</Text>
        </View>

        <Text style={styles.cardMunicipio} numberOfLines={1}>{mipyme.municipio}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => onRemove(mipyme.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="bookmark" size={20} color={Colors.primary[500]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────
// ESTADO VACÍO
// ─────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Feather name="bookmark" size={40} color={Colors.primary[200]} />
      </View>
      <Text style={styles.emptyTitle}>Sin guardados aún</Text>
      <Text style={styles.emptySubtitle}>
        Toca el ícono bookmark en cualquier mipyme para guardarla aquí.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => router.push('/(tabs)' as any)}
        activeOpacity={0.85}
      >
        <Feather name="map" size={18} color={Colors.neutral[0]} />
        <Text style={styles.emptyBtnText}>Explorar mipymes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────
// PANTALLA PRINCIPAL
// ─────────────────────────────────────────
export default function SavedScreen() {
  const savedIds    = useSavedStore((s: SavedStore) => s.savedIds);
  const toggleSaved = useSavedStore((s: SavedStore) => s.toggleSaved);
  const isHydrated  = useSavedStore((s: SavedStore) => s.isHydrated);

  const [refreshing, setRefreshing] = useState(false);

  const queries = useQueries({
    queries: savedIds.map((id: string) => ({
      queryKey:  ['mipyme', id],
      queryFn:   () => getMipymeById(id),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(queries.map(q => q.refetch()));
    setRefreshing(false);
  }, [queries]);

  const isLoading = !isHydrated || queries.some(q => q.isLoading);
  const mipymes   = queries
    .map(q => q.data)
    .filter((m): m is Mipyme => m !== null && m !== undefined);

  const handleRemove = useCallback((id: string) => {
    toggleSaved(id);
  }, [toggleSaved]);

  const handlePress = useCallback((id: string) => {
    router.push(`/mipyme/${id}` as any);
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guardados</Text>
        {savedIds.length > 0 && (
          <View style={styles.headerCount}>
            <Text style={styles.headerCountText}>{savedIds.length}</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      {isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3, 4].map(i => (
            <SavedCardSkeleton key={i} />
          ))}
        </View>
      ) : savedIds.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={mipymes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SavedCard
              mipyme={item}
              onRemove={handleRemove}
              onPress={handlePress}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
          ListFooterComponent={<View style={{ height: 100 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary[500]]}
              tintColor={Colors.primary[500]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: Colors.neutral[100],
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    backgroundColor:   Colors.neutral[0],
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical:   Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    ...Shadows.sm,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.xl,
    color:      Colors.neutral[900],
  },
  headerCount: {
    backgroundColor: Colors.primary[500],
    width:           26,
    height:          26,
    borderRadius:    13,
    alignItems:      'center',
    justifyContent:  'center',
  },
  headerCountText: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[0],
  },
  skeletonList: {
    padding: Spacing.screenPadding,
    gap:     Spacing['3'],
  },
  listContent: {
    padding: Spacing.screenPadding,
  },
  card: {
    flexDirection:   'row',
    backgroundColor: Colors.neutral[0],
    borderRadius:    Radius.lg,
    overflow:        'hidden',
    alignItems:      'center',
    ...Shadows.sm,
  },
  cardImage: {
    width:    88,
    height:   88,
    position: 'relative',
  },
  cardImagePlaceholder: {
    width:          '100%',
    height:         '100%',
    alignItems:     'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex:    1,
    padding: Spacing['3'],
    gap:     3,
  },
  categoriaBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    alignSelf:         'flex-start',
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      Radius.full,
    marginBottom:      2,
  },
  categoriaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
  },
  cardNombre: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[900],
  },
  cardDireccionRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  cardDireccion: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.sm,
    color:      Colors.neutral[500],
    flex:       1,
  },
  cardMunicipio: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[400],
  },
  removeBtn: {
    width:          Sizes.touchTarget,
    height:         Sizes.touchTarget,
    alignItems:     'center',
    justifyContent: 'center',
    paddingRight:   Spacing['2'],
  },
  emptyContainer: {
    flex:              1,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: Spacing['8'],
    paddingBottom:     80,
    gap:               Spacing['3'],
  },
  emptyIconContainer: {
    width:           88,
    height:          88,
    borderRadius:    44,
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    Spacing['2'],
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.xl,
    color:      Colors.neutral[800],
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[500],
    textAlign:  'center',
    lineHeight: 24,
  },
  emptyBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    backgroundColor:   Colors.primary[500],
    paddingHorizontal: Spacing['6'],
    paddingVertical:   Spacing['3'],
    borderRadius:      Radius.button,
    marginTop:         Spacing['2'],
  },
  emptyBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[0],
  },
});