import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MipymePreview, CATEGORIAS } from '../types/mipyme.types';
import { Colors, Typography, Spacing, Radius, Shadows, Sizes } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.screenPadding * 2;

interface MipymeMapCardProps {
  mipyme: MipymePreview;
  onClose: () => void;
}

export default function MipymeMapCard({ mipyme, onClose }: MipymeMapCardProps) {
  const categoriaConfig = CATEGORIAS[mipyme.categoria];

  const handleVisitar = () => {
    router.push(`/mipyme/${mipyme.id}` as any);
  };

  return (
    <View style={[styles.container, { width: CARD_WIDTH }]}>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        {mipyme.imagen_portada ? (
          <Image
            source={{ uri: mipyme.imagen_portada }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: categoriaConfig.color }]}>
            <Feather name={categoriaConfig.icon as any} size={32} color={Colors.neutral[0]} />
          </View>
        )}
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.categoryBadge}>
              <Feather
                name={categoriaConfig.icon as any}
                size={11}
                color={categoriaConfig.color}
              />
              <Text style={[styles.categoryText, { color: categoriaConfig.color }]}>
                {categoriaConfig.label}
              </Text>
            </View>
            {mipyme.verificada && (
              <View style={styles.verifiedBadge}>
                <Feather name="check-circle" size={11} color={Colors.success} />
                <Text style={styles.verifiedText}>Verificada</Text>
              </View>
            )}
          </View>
          {/* Botón cerrar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={18} color={Colors.neutral[500]} />
          </TouchableOpacity>
        </View>

        {/* Nombre */}
        <Text style={styles.nombre} numberOfLines={1}>
          {mipyme.nombre}
        </Text>

        {/* Dirección */}
        <View style={styles.direccionRow}>
          <Feather name="map-pin" size={13} color={Colors.neutral[500]} />
          <Text style={styles.direccion} numberOfLines={1}>
            {mipyme.direccion}
          </Text>
        </View>

        {/* Botón Visitar */}
        <TouchableOpacity style={styles.visitButton} onPress={handleVisitar} activeOpacity={0.85}>
          <Text style={styles.visitButtonText}>Visitar</Text>
          <Feather name="arrow-right" size={16} color={Colors.neutral[0]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.lg,
  },
  imageContainer: {
    width: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing['3'],
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  categoryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: Typography.size.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedText: {
    fontFamily: 'Inter_500Medium',
    fontSize: Typography.size.xs,
    color: Colors.success,
  },
  closeButton: {
    width: Sizes.touchTarget,
    height: Sizes.touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  nombre: {
    fontFamily: 'Inter_700Bold',
    fontSize: Typography.size.md,
    color: Colors.neutral[900],
    marginTop: 4,
  },
  direccionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  direccion: {
    fontFamily: 'Inter_400Regular',
    fontSize: Typography.size.sm,
    color: Colors.neutral[600],
    flex: 1,
  },
  visitButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: Radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    marginTop: 8,
  },
  visitButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: Typography.size.base,
    color: Colors.neutral[0],
  },
});