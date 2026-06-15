import { supabase } from './supabase';
import { MipymePreview, Mipyme, MipymeCategoria } from '../types/mipyme.types';
import { Producto } from '../types/product.types';

// ─────────────────────────────────────────
// MIPYMES
// ─────────────────────────────────────────

export async function getMipymesCercanas(
  lat: number,
  lng: number,
  radioKm: number = 15,
  categoria?: MipymeCategoria
): Promise<MipymePreview[]> {
  const { data, error } = await supabase.rpc('mipymes_cercanas', {
    lat_input: lat,
    lng_input: lng,
    radio_km:  radioKm,
    cat:       categoria ?? null,
  });

  if (error) throw new Error(error.message);

  return (data ?? []).map((m: any) => ({
    id:             m.id,
    nombre:         m.nombre,
    categoria:      m.categoria as MipymeCategoria,
    direccion:      m.direccion,
    imagen_portada: m.imagen_portada,
    lat:            m.lat,
    lng:            m.lng,
    verificada:     m.verificada,
    distancia_km:   m.distancia_km,
  }));
}

export async function getMipymeById(id: string): Promise<Mipyme | null> {
  const { data, error } = await supabase
    .from('mipymes')
    .select('*')
    .eq('id', id)
    .eq('activa', true)
    .single();

  if (error) return null;
  return data as Mipyme;
}

export async function getMipymes(categoria?: MipymeCategoria): Promise<MipymePreview[]> {
  let query = supabase
    .from('mipymes')
    .select('id, nombre, categoria, direccion, imagen_portada, lat, lng, verificada')
    .eq('activa', true)
    .order('plan', { ascending: false }) // premium primero
    .order('nombre');

  if (categoria) {
    query = query.eq('categoria', categoria);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as MipymePreview[];
}

export async function buscarMipymes(texto: string): Promise<MipymePreview[]> {
  const { data, error } = await supabase
    .from('mipymes')
    .select('id, nombre, categoria, direccion, imagen_portada, lat, lng, verificada')
    .eq('activa', true)
    .or(`nombre.ilike.%${texto}%,direccion.ilike.%${texto}%,descripcion.ilike.%${texto}%`)
    .limit(20);

  if (error) throw new Error(error.message);
  return (data ?? []) as MipymePreview[];
}

// ─────────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────────

export async function getProductosByMipyme(mipymeId: string): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('mipyme_id', mipymeId)
    .eq('disponible', true)
    .order('nombre');

  if (error) throw new Error(error.message);
  return (data ?? []) as Producto[];
}

// ─────────────────────────────────────────
// HORARIOS
// ─────────────────────────────────────────

export interface Horario {
  id:            string;
  mipyme_id:     string;
  dia:           number;
  hora_apertura: string | null;
  hora_cierre:   string | null;
  cerrado:       boolean;
}

export async function getHorariosByMipyme(mipymeId: string): Promise<Horario[]> {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .eq('mipyme_id', mipymeId)
    .order('dia');

  if (error) throw new Error(error.message);
  return (data ?? []) as Horario[];
}

// ─────────────────────────────────────────
// HELPERS — estado abierto/cerrado
// ─────────────────────────────────────────

export function estaAbierto(horarios: Horario[]): boolean {
  const ahora  = new Date();
  const diaSemana = ahora.getDay(); // 0=domingo
  const horaActual = `${String(ahora.getHours()).padStart(2,'0')}:${String(ahora.getMinutes()).padStart(2,'0')}`;

  const horarioHoy = horarios.find(h => h.dia === diaSemana);
  if (!horarioHoy || horarioHoy.cerrado) return false;
  if (!horarioHoy.hora_apertura || !horarioHoy.hora_cierre) return false;

  return horaActual >= horarioHoy.hora_apertura && horaActual <= horarioHoy.hora_cierre;
}

export function getHorarioHoy(horarios: Horario[]): string {
  const diaSemana = new Date().getDay();
  const horarioHoy = horarios.find(h => h.dia === diaSemana);

  if (!horarioHoy || horarioHoy.cerrado) return 'Cerrado hoy';
  if (!horarioHoy.hora_apertura || !horarioHoy.hora_cierre) return 'Sin horario';

  const formatHora = (h: string) => {
    const [hora, min] = h.split(':');
    const h12 = parseInt(hora) > 12 ? parseInt(hora) - 12 : parseInt(hora);
    const ampm = parseInt(hora) >= 12 ? 'PM' : 'AM';
    return `${h12}:${min} ${ampm}`;
  };

  return `${formatHora(horarioHoy.hora_apertura)} – ${formatHora(horarioHoy.hora_cierre)}`;
}