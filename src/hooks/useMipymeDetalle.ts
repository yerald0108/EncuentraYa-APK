import { useQuery } from '@tanstack/react-query';
import { getMipymeById, getHorariosByMipyme, getProductosByMipyme } from '../services/api';

export function useMipymeDetalle(id: string | null) {
  const mipymeQuery = useQuery({
    queryKey: ['mipyme', id],
    queryFn:  () => getMipymeById(id!),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
  });

  const horariosQuery = useQuery({
    queryKey: ['horarios', id],
    queryFn:  () => getHorariosByMipyme(id!),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
  });

  const productosQuery = useQuery({
    queryKey: ['productos', id],
    queryFn:  () => getProductosByMipyme(id!),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    mipyme:    mipymeQuery.data ?? null,
    horarios:  horariosQuery.data ?? [],
    productos: productosQuery.data ?? [],
    isLoading: mipymeQuery.isLoading || horariosQuery.isLoading,
    isError:   mipymeQuery.isError,
  };
}