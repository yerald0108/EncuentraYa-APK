import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Animated,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useMipymeDetalle } from '../../src/hooks/useMipymeDetalle';
import { estaAbierto, getHorarioHoy } from '../../src/services/api';
import { CATEGORIAS } from '../../src/types/mipyme.types';
import { Producto } from '../../src/types/product.types';
import ProductoCard from '../../src/components/ProductoCard';
import { Colors, Typography, Spacing, Radius, Shadows, Sizes } from '../../src/theme/theme';
import ErrorView from '../../src/components/ui/ErrorView';
import EmptyState from '../../src/components/ui/EmptyState';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_IMAGE_HEIGHT = SCREEN_HEIGHT * 0.38;

// ─────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────
function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: any;
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
      style={[{ width, height, borderRadius, backgroundColor: Colors.neutral[200], opacity }, style]}
    />
  );
}

// ─────────────────────────────────────────
// SKELETON DE PANTALLA COMPLETA
// ─────────────────────────────────────────
function DetailSkeleton({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral[50] }}>
      <SkeletonBox width={"100%" as `${number}%`} height={HEADER_IMAGE_HEIGHT} borderRadius={0} />
      <TouchableOpacity
        style={[skeletonStyles.backBtn, { top: insets.top + 8 }]}
        onPress={onBack}
      >
        <Feather name="arrow-left" size={22} color={Colors.neutral[0]} />
      </TouchableOpacity>
      <View style={{ padding: Spacing.screenPadding, gap: 12 }}>
        <SkeletonBox width={"40%" as `${number}%`} height={16} />
        <SkeletonBox width={"75%" as `${number}%`} height={28} />
        <SkeletonBox width={"90%" as `${number}%`} height={16} />
        <View style={{ height: 8 }} />
        <SkeletonBox width={"100%" as `${number}%`} height={1} />
        <View style={{ height: 8 }} />
        <SkeletonBox width={"60%" as `${number}%`} height={16} />
        <SkeletonBox width={"50%" as `${number}%`} height={16} />
        <SkeletonBox width={"70%" as `${number}%`} height={16} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  backBtn: {
    position:        'absolute',
    left:            Spacing.screenPadding,
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems:      'center',
    justifyContent:  'center',
  },
});

// ─────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────
export default function MipymeDetailScreen() {
  const { id }  = useLocalSearchParams<{ id: string }>();
  const insets  = useSafeAreaInsets();

  const { mipyme, horarios, productos, isLoading, isError, refetch } =
    useMipymeDetalle(id ?? null);

  const handleBack = useCallback(() => router.back(), []);

  const handleLlamar = useCallback(() => {
    if (mipyme?.telefono) {
      Linking.openURL(`tel:${mipyme.telefono}`);
    }
  }, [mipyme?.telefono]);

  const handleWhatsApp = useCallback(() => {
    if (mipyme?.whatsapp) {
      const numero = mipyme.whatsapp.replace(/\D/g, '');
      Linking.openURL(`https://wa.me/${numero}`);
    }
  }, [mipyme?.whatsapp]);

  // ── Loading ──────────────────────────────
  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <DetailSkeleton onBack={handleBack} />
      </>
    );
  }

  // ── Error ────────────────────────────────
  if (isError || !mipyme) {
    return (
      <View style={styles.errorScreen}>
        <StatusBar style="dark" />
        <TouchableOpacity style={styles.backBtnDark} onPress={handleBack}>
          <Feather name="arrow-left" size={22} color={Colors.neutral[700]} />
        </TouchableOpacity>
        <ErrorView
          title="No encontrado"
          subtitle="No pudimos cargar la información de esta mipyme."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const abierto         = horarios.length > 0 ? estaAbierto(horarios)   : null;
  const horarioTexto    = horarios.length > 0 ? getHorarioHoy(horarios) : null;
  const categoriaConfig = CATEGORIAS[mipyme.categoria];

  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.productoWrapper}>
      <ProductoCard producto={item} />
    </View>
  );

  // Header del FlatList (toda la info de la mipyme)
  const ListHeader = () => (
    <>
      {/* ── IMAGEN PORTADA ── */}
      <View style={styles.imageContainer}>
        {mipyme.imagen_portada ? (
          <Image
            source={{ uri: mipyme.imagen_portada }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: categoriaConfig.color }]}>
            <Feather name={categoriaConfig.icon as any} size={64} color={Colors.neutral[0]} />
          </View>
        )}

        {/* Gradiente oscuro inferior */}
        <View style={styles.imageGradient} />

        {/* Botón volver */}
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 8 }]}
          onPress={handleBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={Colors.neutral[0]} />
        </TouchableOpacity>

        {/* Badge premium */}
        {mipyme.plan === 'premium' && (
          <View style={styles.premiumBadge}>
            <Feather name="star" size={12} color="#F59E0B" />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}

        {/* Nombre sobre la imagen */}
        <View style={styles.imageTitleContainer}>
          <Text style={styles.imageTitle}>{mipyme.nombre}</Text>
          <View style={styles.imageBadgesRow}>
            <View style={styles.categoriaBadgeOnImage}>
              <Feather name={categoriaConfig.icon as any} size={11} color={Colors.neutral[0]} />
              <Text style={styles.categoriaBadgeText}>{categoriaConfig.label}</Text>
            </View>
            {mipyme.verificada && (
              <View style={styles.verificadaBadgeOnImage}>
                <Feather name="check-circle" size={11} color={Colors.neutral[0]} />
                <Text style={styles.verificadaBadgeText}>Verificada</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── CUERPO ── */}
      <View style={styles.body}>

        {/* Descripción */}
        {mipyme.descripcion ? (
          <Text style={styles.descripcion}>{mipyme.descripcion}</Text>
        ) : null}

        <View style={styles.divider} />

        {/* Info rows */}
        <View style={styles.infoSection}>
          {/* Dirección */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Feather name="map-pin" size={16} color={Colors.primary[500]} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Dirección</Text>
              <Text style={styles.infoValue}>{mipyme.direccion}</Text>
              <Text style={styles.infoSub}>{mipyme.municipio}</Text>
            </View>
          </View>

          {/* Horario */}
          {abierto !== null && (
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather
                  name="clock"
                  size={16}
                  color={abierto ? Colors.success : Colors.error}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Horario de hoy</Text>
                <View style={styles.horarioRow}>
                  <View style={[
                    styles.estadoBadge,
                    { backgroundColor: abierto ? Colors.success + '20' : Colors.error + '20' },
                  ]}>
                    <Text style={[
                      styles.estadoText,
                      { color: abierto ? Colors.success : Colors.error },
                    ]}>
                      {abierto ? 'Abierto ahora' : 'Cerrado'}
                    </Text>
                  </View>
                  {horarioTexto && (
                    <Text style={styles.horarioText}>{horarioTexto}</Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Teléfono */}
          {mipyme.telefono ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Feather name="phone" size={16} color={Colors.primary[500]} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{mipyme.telefono}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* ── BOTONES DE ACCIÓN ── */}
        <View style={styles.actionButtons}>
          {mipyme.telefono && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={handleLlamar}
              activeOpacity={0.85}
            >
              <Feather name="phone" size={18} color={Colors.neutral[0]} />
              <Text style={styles.actionBtnPrimaryText}>Llamar</Text>
            </TouchableOpacity>
          )}
          {mipyme.whatsapp && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnWhatsApp]}
              onPress={handleWhatsApp}
              activeOpacity={0.85}
            >
              <Feather name="message-circle" size={18} color={Colors.neutral[0]} />
              <Text style={styles.actionBtnPrimaryText}>WhatsApp</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        {/* Título sección productos */}
        <View style={styles.productosSectionHeader}>
          <Text style={styles.productosSectionTitle}>
            Productos disponibles
          </Text>
          <View style={styles.productosCountBadge}>
            <Text style={styles.productosCountText}>{productos.length}</Text>
          </View>
        </View>
      </View>
    </>
  );

  // Estado vacío de productos
  const ListEmpty = () => (
    <View style={styles.emptyProductos}>
      <EmptyState
        icon="package"
        title="Sin productos aún"
        subtitle="Esta mipyme no ha publicado productos todavía."
      />
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderProducto}
        numColumns={2}
        columnWrapperStyle={styles.productosRow}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={<View style={{ height: insets.bottom + 24 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

// ─────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: Colors.neutral[50],
  },

  // Imagen header
  imageContainer: {
    width:    SCREEN_WIDTH,
    height:   HEADER_IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width:          '100%',
    height:         '100%',
    alignItems:     'center',
    justifyContent: 'center',
  },
  imageGradient: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          '65%' as `${number}%`,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backBtn: {
    position:        'absolute',
    left:            Spacing.screenPadding,
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: 'rgba(0,0,0,0.40)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  premiumBadge: {
    position:          'absolute',
    top:               12,
    right:             Spacing.screenPadding,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   'rgba(0,0,0,0.50)',
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      Radius.full,
  },
  premiumText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      '#F59E0B',
  },
  imageTitleContainer: {
    position: 'absolute',
    bottom:   Spacing['5'],
    left:     Spacing.screenPadding,
    right:    Spacing.screenPadding,
  },
  imageTitle: {
    fontFamily:  'Inter_700Bold',
    fontSize:    Typography.size['3xl'],
    color:       Colors.neutral[0],
    marginBottom: 8,
    textShadowColor:  'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  imageBadgesRow: {
    flexDirection: 'row',
    gap:           8,
  },
  categoriaBadgeOnImage: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    backgroundColor:   'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      Radius.full,
  },
  categoriaBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[0],
  },
  verificadaBadgeOnImage: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    backgroundColor:   Colors.success + '40',
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      Radius.full,
  },
  verificadaBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[0],
  },

  // Cuerpo
  body: {
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.screenPadding,
    paddingTop:        Spacing['5'],
    paddingBottom:     Spacing['2'],
    ...Shadows.sm,
  },
  descripcion: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[600],
    lineHeight: 24,
  },
  divider: {
    height:          1,
    backgroundColor: Colors.neutral[100],
    marginVertical:  Spacing['4'],
  },

  // Info section
  infoSection: {
    gap: Spacing['4'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           Spacing['3'],
  },
  infoIconBox: {
    width:           38,
    height:          38,
    borderRadius:    Radius.md,
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
  },
  infoContent: {
    flex: 1,
    gap:  2,
  },
  infoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[800],
  },
  infoSub: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.sm,
    color:      Colors.neutral[500],
  },
  horarioRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    flexWrap:      'wrap',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      Radius.full,
  },
  estadoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
  },
  horarioText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.sm,
    color:      Colors.neutral[500],
  },

  // Botones de acción
  actionButtons: {
    flexDirection: 'row',
    gap:           Spacing['3'],
    marginTop:     Spacing['4'],
  },
  actionBtn: {
    flex:           1,
    height:         Sizes.buttonHeight,
    borderRadius:   Radius.button,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary[500],
  },
  actionBtnWhatsApp: {
    backgroundColor: '#25D366',
  },
  actionBtnPrimaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[0],
  },

  // Sección productos
  productosSectionHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            10,
    marginBottom:   Spacing['2'],
  },
  productosSectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.lg,
    color:      Colors.neutral[900],
  },
  productosCountBadge: {
    backgroundColor:   Colors.primary[500],
    width:             26,
    height:            26,
    borderRadius:      13,
    alignItems:        'center',
    justifyContent:    'center',
  },
  productosCountText: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[0],
  },

  // Grid de productos
  flatListContent: {
    backgroundColor: Colors.neutral[50],
  },
  productosRow: {
    paddingHorizontal: Spacing.screenPadding,
    gap:               Spacing['3'],
    marginBottom:      Spacing['3'],
  },
  productoWrapper: {
    flex: 1,
  },

  // Estado vacío
  emptyProductos: {
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical: Spacing['10'],
    paddingHorizontal: Spacing['8'],
    gap:             Spacing['3'],
  },

  // Error screen
  errorScreen: {
    flex:            1,
    backgroundColor: Colors.neutral[0],
    alignItems:      'center',
    justifyContent:  'center',
    padding:         Spacing.screenPadding,
    gap:             Spacing['3'],
  },
  backBtnDark: {
    position: 'absolute',
    top:      60,
    left:     Spacing.screenPadding,
    width:    44,
    height:   44,
    alignItems:     'center',
    justifyContent: 'center',
  },
});