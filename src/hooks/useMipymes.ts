import { useQuery } from '@tanstack/react-query';
import { getMipymes, getMipymesCercanas, buscarMipymes } from '../services/api';
import { MipymeCategoria } from '../types/mipyme.types';

// Todas las mipymes (sin ubicación del usuario)
export function useMipymes(categoria?: MipymeCategoria) {
  return useQuery({
    queryKey: ['mipymes', categoria ?? 'todos'],
    queryFn:  () => getMipymes(categoria),
    staleTime: 1000 * 60 * 5, // 5 minutos de caché
  });
}

// Mipymes cercanas (con ubicación del usuario)
export function useMipymesCercanas(
  lat?: number,
  lng?: number,
  categoria?: MipymeCategoria
) {
  return useQuery({
    queryKey: ['mipymes_cercanas', lat, lng, categoria ?? 'todos'],
    queryFn:  () => getMipymesCercanas(lat!, lng!, 15, categoria),
    enabled:  lat !== undefined && lng !== undefined,
    staleTime: 1000 * 60 * 2,
  });
}

// Búsqueda por texto
export function useBuscarMipymes(texto: string) {
  return useQuery({
    queryKey: ['mipymes_buscar', texto],
    queryFn:  () => buscarMipymes(texto),
    enabled:  texto.trim().length >= 2,
    staleTime: 1000 * 30,
  });
}