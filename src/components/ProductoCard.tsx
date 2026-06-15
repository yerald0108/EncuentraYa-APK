import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Producto } from '../types/product.types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/theme';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  return (
    <View style={styles.card}>
      {/* Imagen o placeholder */}
      <View style={styles.imageContainer}>
        {producto.imagen ? (
          <Image
            source={{ uri: producto.imagen }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="package" size={28} color={Colors.primary[300]} />
          </View>
        )}

        {/* Badge sin stock */}
        {producto.cantidad === 0 && (
          <View style={styles.sinStockBadge}>
            <Text style={styles.sinStockText}>Sin stock</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={2}>{producto.nombre}</Text>
        {producto.descripcion ? (
          <Text style={styles.descripcion} numberOfLines={2}>
            {producto.descripcion}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.precio}>
            {producto.precio.toLocaleString()} CUP
          </Text>
          {producto.cantidad > 0 && (
            <View style={styles.cantidadBadge}>
              <Text style={styles.cantidadText}>{producto.cantidad} disp.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.neutral[0],
    borderRadius:    Radius.lg,
    overflow:        'hidden',
    ...Shadows.sm,
  },
  imageContainer: {
    width:    '100%',
    height:   130,
    position: 'relative',
  },
  image: {
    width:  '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width:           '100%',
    height:          '100%',
    backgroundColor: Colors.primary[50],
    alignItems:      'center',
    justifyContent:  'center',
  },
  sinStockBadge: {
    position:          'absolute',
    top:               8,
    left:              8,
    backgroundColor:   'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      Radius.full,
  },
  sinStockText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.xs,
    color:      Colors.neutral[0],
  },
  info: {
    padding: Spacing['3'],
    gap:     4,
  },
  nombre: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Typography.size.base,
    color:      Colors.neutral[900],
  },
  descripcion: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Typography.size.sm,
    color:      Colors.neutral[500],
    lineHeight: 18,
  },
  footer: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      Spacing['1'],
  },
  precio: {
    fontFamily: 'Inter_700Bold',
    fontSize:   Typography.size.md,
    color:      Colors.primary[500],
  },
  cantidadBadge: {
    backgroundColor:   Colors.success + '18',
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      Radius.full,
  },
  cantidadText: {
    fontFamily: 'Inter_500Medium',
    fontSize:   Typography.size.xs,
    color:      Colors.success,
  },
});