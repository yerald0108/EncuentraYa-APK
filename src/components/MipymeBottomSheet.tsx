import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMipymeDetalle } from '../hooks/useMipymeDetalle';
import { estaAbierto, getHorarioHoy } from '../services/api';
import { CATEGORIAS } from '../types/mipyme.types';
import { Colors, Typography, Spacing, Radius, Shadows, Sizes } from '../theme/theme';
import { useTabBarStore } from '../stores/useTabBarStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT    = SCREEN_HEIGHT * 0.82;
const DRAG_THRESHOLD  = 80;

// ─────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────
function SkeletonBox({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
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
    <Animated.View style={{ width, height, borderRadius, backgroundColor: Colors.neutral[200], opacity }} />
  );
}

// ─────────────────────────────────────────────────────
// FILA DE PRODUCTO
// ─────────────────────────────────────────────────────
function ProductoRow({ nombre, precio }: { nombre: string; precio: number }) {
  return (
    <View style={styles.productoRow}>
      <View style={styles.productoIcon}>
        <Feather name="package" size={14} color={Colors.primary[500]} />
      </View>
      <Text style={styles.productoNombre} numberOfLines={1}>{nombre}</Text>
      <Text style={styles.productoPrecio}>{precio.toLocaleString()} CUP</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────
interface MipymeBottomSheetProps {
  mipymeId:    string | null;
  onClose:     () => void;
}

// ─────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────
export default function MipymeBottomSheet({
  mipymeId,
  onClose,
}: MipymeBottomSheetProps) {
  const insets      = useSafeAreaInsets();
  const translateY  = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOp  = useRef(new Animated.Value(0)).current;
  const dragY       = useRef(new Animated.Value(0)).current;
  const scrollRef   = useRef<ScrollView>(null);
  const isScrolling = useRef(false);
  const dragStart   = useRef(0);
  const [guardado, setGuardado] = useState(false);

  const { hideTabBar, showTabBar } = useTabBarStore();
  const { mipyme, horarios, productos, isLoading } = useMipymeDetalle(mipymeId);

  // ── Abrir ──────────────────────────────────────────
  const openSheet = useCallback(() => {
    hideTabBar();
    Animated.parallel([
      Animated.spring(translateY, {
        toValue:  0,
        tension:  65,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOp, {
        toValue:  1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hideTabBar]);

  // ── Cerrar ─────────────────────────────────────────
  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue:  SHEET_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOp, {
        toValue:  0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => {
      showTabBar();
      setGuardado(false);
      onClose();
    });
  }, [onClose, showTabBar]);

  useEffect(() => {
    if (mipymeId) {
      translateY.setValue(SHEET_HEIGHT);
      dragY.setValue(0);
      openSheet();
    }
  }, [mipymeId]);

  if (!mipymeId) return null;

  const abierto         = horarios.length > 0 ? estaAbierto(horarios) : null;
  const horarioTexto    = horarios.length > 0 ? getHorarioHoy(horarios) : null;
  const categoriaConfig = mipyme ? CATEGORIAS[mipyme.categoria] : null;

  // La posición final del sheet combina la animación de entrada + el drag
  const sheetTranslate = Animated.add(translateY, dragY);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

      {/* ── BACKDROP ── */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOp }]}
        pointerEvents="auto"
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeSheet} activeOpacity={1} />
      </Animated.View>

      {/* ── SHEET ── */}
      <Animated.View
        style={[
          styles.sheet,
          { height: SHEET_HEIGHT + insets.bottom },
          { transform: [{ translateY: sheetTranslate }] },
        ]}
      >
        {/* Handle + Header */}
        <View style={styles.headerArea}>
          {/* Handle de drag */}
          <View style={styles.handleBar} />

          {/* Botones X y Guardar */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={closeSheet}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="x" size={20} color={Colors.neutral[600]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.headerBtn, guardado && styles.headerBtnActive]}
              onPress={() => setGuardado(g => !g)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather
                name={guardado ? 'bookmark' : 'bookmark'}
                size={20}
                color={guardado ? Colors.neutral[0] : Colors.neutral[600]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SCROLL INTERNO ── */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          bounces={true}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          // Estas dos props son clave para evitar que el scroll mueva el mapa
          onScrollBeginDrag={() => { isScrolling.current = true; }}
          onScrollEndDrag={()   => { isScrolling.current = false; }}
          onMomentumScrollBegin={() => { isScrolling.current = true; }}
          onMomentumScrollEnd={()   => { isScrolling.current = false; }}
          nestedScrollEnabled
        >
          {isLoading ? (
            // ── SKELETON ──────────────────────────────
            <View>
              <SkeletonBox width={"100%" as `${number}%`} height={200} borderRadius={0} />
              <View style={{ padding: Spacing.screenPadding, gap: 10 }}>
                <SkeletonBox width={"60%" as `${number}%`} height={26} />
                <SkeletonBox width={"40%" as `${number}%`} height={16} />
                <View style={{ height: 8 }} />
                <SkeletonBox width={"80%" as `${number}%`} height={14} />
                <SkeletonBox width={"70%" as `${number}%`} height={14} />
                <View style={{ height: 8 }} />
                <SkeletonBox width={"100%" as `${number}%`} height={50} borderRadius={12} />
              </View>
            </View>
          ) : mipyme ? (
            <>
              {/* ── IMAGEN ── */}
              <View style={styles.imageContainer}>
                {mipyme.imagen_portada ? (
                  <Image
                    source={{ uri: mipyme.imagen_portada }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.imagePlaceholder, { backgroundColor: categoriaConfig?.color }]}>
                    <Feather name={categoriaConfig?.icon as any} size={48} color={Colors.neutral[0]} />
                  </View>
                )}
                {mipyme.plan === 'premium' && (
                  <View style={styles.premiumBadge}>
                    <Feather name="star" size={11} color="#F59E0B" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>

              {/* ── CUERPO ── */}
              <View style={styles.body}>

                {/* Badges */}
                <View style={styles.badgesRow}>
                  <View style={[
                    styles.categoriaBadge,
                    { backgroundColor: (categoriaConfig?.color ?? '#000') + '18' }
                  ]}>
                    <Feather name={categoriaConfig?.icon as any} size={12} color={categoriaConfig?.color} />
                    <Text style={[styles.categoriaText, { color: categoriaConfig?.color }]}>
                      {categoriaConfig?.label}
                    </Text>
                  </View>
                  {mipyme.verificada && (
                    <View style={styles.verificadaBadge}>
                      <Feather name="check-circle" size={12} color={Colors.success} />
                      <Text style={styles.verificadaText}>Verificada</Text>
                    </View>
                  )}
                </View>

                {/* Nombre */}
                <Text style={styles.nombre}>{mipyme.nombre}</Text>

                {/* Descripción */}
                {mipyme.descripcion ? (
                  <Text style={styles.descripcion}>{mipyme.descripcion}</Text>
                ) : null}

                <View style={styles.divider} />

                {/* Info */}
                <View style={styles.infoContainer}>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Feather name="map-pin" size={15} color={Colors.primary[500]} />
                    </View>
                    <Text style={styles.infoText}>{mipyme.direccion}</Text>
                  </View>

                  {abierto !== null && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Feather name="clock" size={15} color={abierto ? Colors.success : Colors.error} />
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={[
                          styles.estadoBadge,
                          { backgroundColor: abierto ? Colors.success + '18' : Colors.error + '18' }
                        ]}>
                          <Text style={[styles.estadoText, { color: abierto ? Colors.success : Colors.error }]}>
                            {abierto ? 'Abierto ahora' : 'Cerrado'}
                          </Text>
                        </View>
                        {horarioTexto && (
                          <Text style={styles.horarioText}>{horarioTexto}</Text>
                        )}
                      </View>
                    </View>
                  )}

                  {mipyme.telefono ? (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Feather name="phone" size={15} color={Colors.primary[500]} />
                      </View>
                      <Text style={styles.infoText}>{mipyme.telefono}</Text>
                    </View>
                  ) : null}

                  {mipyme.whatsapp ? (
                    <View style={styles.infoRow}>
                      <View style={styles.infoIcon}>
                        <Feather name="message-circle" size={15} color="#25D366" />
                      </View>
                      <Text style={[styles.infoText, { color: '#25D366' }]}>
                        WhatsApp disponible
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Productos */}
                {productos.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.productosTitle}>Productos disponibles</Text>
                    {productos.slice(0, 3).map(p => (
                      <ProductoRow key={p.id} nombre={p.nombre} precio={p.precio} />
                    ))}
                    {productos.length > 3 && (
                      <Text style={styles.masProductos}>
                        +{productos.length - 3} productos más
                      </Text>
                    )}
                  </>
                )}

                {/* Botón ver productos */}
                <TouchableOpacity
                  style={styles.verProductosBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    closeSheet();
                    router.push(`/mipyme/${mipyme.id}` as any);
                  }}
                >
                  <Feather name="grid" size={18} color={Colors.neutral[0]} />
                  <Text style={styles.verProductosText}>Ver todos los productos</Text>
                  <Feather name="arrow-right" size={18} color={Colors.neutral[0]} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={40} color={Colors.neutral[300]} />
              <Text style={styles.errorText}>No se pudo cargar la información</Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position:             'absolute',
    bottom:               0,
    left:                 0,
    right:                0,
    backgroundColor:      Colors.neutral[0],
    borderTopLeftRadius:  Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    overflow:             'hidden',
    ...Shadows.mapCard,
  },

  // Header
  headerArea: {
    paddingTop:       10,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom:    8,
    alignItems:       'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  handleBar: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: Colors.neutral[300],
    marginBottom:    12,
  },
  headerButtons: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    width:          '100%',
  },
  headerBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: Colors.neutral[100],
    alignItems:      'center',
    justifyContent:  'center',
  },
  headerBtnActive: {
    backgroundColor: Colors.primary[500],
  },

  // Imagen
  imageContainer: {
    width:    '100%',
    height:   210,
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
  premiumBadge: {
    position:          'absolute',
    top:               12,
    right:             12,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      Radius.full,
  },
  premiumText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      '#F59E0B',
  },

  // Cuerpo
  body: {
    padding: Spacing.screenPadding,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    marginBottom:  Spacing['2'],
  },
  categoriaBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      Radius.full,
  },
  categoriaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
  },
  verificadaBadge: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  verificadaText: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.xs,
    color:      Colors.success,
  },
  nombre: {
    fontFamily:   'Inter_700Bold',
    fontSize:     Typography.size['2xl'],
    color:        Colors.neutral[900],
    marginBottom: Spacing['2'],
  },
  descripcion: {
    fontFamily:   'Inter_400Regular',
    fontSize:     Typography.size.base,
    color:        Colors.neutral[600],
    lineHeight:   22,
    marginBottom: Spacing['2'],
  },
  divider: {
    height:          1,
    backgroundColor: Colors.neutral[100],
    marginVertical:  Spacing['4'],
  },

  // Info
  infoContainer: {
    gap: Spacing['3'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           Spacing['3'],
  },
  infoIcon: {
    width:           32,
    height:          32,
    borderRadius:    Radius.md,
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[700],
    flex:       1,
    paddingTop: 6,
  },
  estadoBadge: {
    alignSelf:         'flex-start',
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

  // Productos
  productosTitle: {
    fontFamily:   'Inter_600SemiBold',
    fontSize:     Typography.size.base,
    color:        Colors.neutral[800],
    marginBottom: Spacing['2'],
  },
  productoRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing['3'],
    paddingVertical:   Spacing['2'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  productoIcon: {
    width:           32,
    height:          32,
    borderRadius:    Radius.md,
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
  },
  productoNombre: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[700],
    flex:       1,
  },
  productoPrecio: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.base,
    color:      Colors.primary[500],
  },
  masProductos: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.sm,
    color:      Colors.primary[500],
    textAlign:  'center',
    marginTop:  Spacing['2'],
  },

  // Botón
  verProductosBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing['2'],
    backgroundColor: Colors.primary[500],
    borderRadius:    Radius.button,
    height:          Sizes.buttonHeight,
    marginTop:       Spacing['5'],
  },
  verProductosText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.md,
    color:      Colors.neutral[0],
    flex:       1,
    textAlign:  'center',
  },

  // Error
  errorContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    padding:        Spacing['10'],
    gap:            Spacing['3'],
  },
  errorText: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[500],
    textAlign:  'center',
  },
});