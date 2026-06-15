export type MipymeCategoria =
  | 'bodega'
  | 'cafeteria'
  | 'restaurante'
  | 'peluqueria'
  | 'mecanico'
  | 'tienda'
  | 'farmacia'
  | 'panaderia'
  | 'otro';

export interface CategoriaConfig {
  label: string;
  icon: string;       // nombre del ícono Feather
  color: string;      // color del pin en el mapa
}

export const CATEGORIAS: Record<MipymeCategoria, CategoriaConfig> = {
  bodega:      { label: 'Bodega',      icon: 'shopping-bag', color: '#1A3A5C' },
  cafeteria:   { label: 'Cafetería',   icon: 'coffee',       color: '#92400E' },
  restaurante: { label: 'Restaurante', icon: 'star',         color: '#CC2936' },
  peluqueria:  { label: 'Peluquería',  icon: 'scissors',     color: '#7C3AED' },
  mecanico:    { label: 'Mecánico',    icon: 'tool',         color: '#374151' },
  tienda:      { label: 'Tienda',      icon: 'tag',          color: '#065F46' },
  farmacia:    { label: 'Farmacia',    icon: 'plus-circle',  color: '#2D9B5A' },
  panaderia:   { label: 'Panadería',   icon: 'sun',          color: '#D97706' },
  otro:        { label: 'Otro',        icon: 'grid',         color: '#6B7280' },
};

export interface Mipyme {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: MipymeCategoria;
  direccion: string;
  municipio: string;
  telefono?: string;
  whatsapp?: string;
  horario?: string;
  imagen_portada?: string;
  imagenes?: string[];
  lat: number;
  lng: number;
  activa: boolean;
  verificada: boolean;
  plan: 'basico' | 'premium';
  created_at: string;
  updated_at: string;
}

export interface MipymePreview {
  id:             string;
  nombre:         string;
  categoria:      MipymeCategoria;
  direccion:      string;
  imagen_portada?: string;
  lat:            number;
  lng:            number;
  verificada:     boolean;
  distancia_km?:  number;
}