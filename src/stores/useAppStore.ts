import { create } from 'zustand';
import { MipymePreview } from '../types/mipyme.types';

interface AppState {
  // Mipymes cargadas en mapa
  mipymes: MipymePreview[];
  setMipymes: (mipymes: MipymePreview[]) => void;

  // Mipyme seleccionada en el mapa
  selectedMipyme: MipymePreview | null;
  setSelectedMipyme: (mipyme: MipymePreview | null) => void;

  // Mipymes guardadas por el usuario
  savedMipymes: string[];
  toggleSaved: (id: string) => void;

  // Ubicación del usuario
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number }) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  mipymes: [],
  setMipymes: (mipymes) => set({ mipymes }),

  selectedMipyme: null,
  setSelectedMipyme: (mipyme) => set({ selectedMipyme: mipyme }),

  savedMipymes: [],
  toggleSaved: (id) => {
    const current = get().savedMipymes;
    const isAlreadySaved = current.includes(id);
    set({
      savedMipymes: isAlreadySaved
        ? current.filter((sid) => sid !== id)
        : [...current, id],
    });
  },

  userLocation: null,
  setUserLocation: (loc) => set({ userLocation: loc }),
}));