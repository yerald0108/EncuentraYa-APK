export interface Producto {
  id:          string;
  mipyme_id:   string;
  nombre:      string;
  descripcion?: string;
  precio:      number;
  imagen?:     string;
  disponible:  boolean;
  cantidad:    number;
  created_at:  string;
}