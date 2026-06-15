import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'encuentraya_saved';

interface SavedStore {
  savedIds:    string[];
  isHydrated:  boolean;
  hydrate:     () => Promise<void>;
  toggleSaved: (id: string) => void;
  isSaved:     (id: string) => boolean;
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  savedIds:   [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      set({ savedIds: ids, isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },

  toggleSaved: (id: string) => {
    const current = get().savedIds;
    const already = current.includes(id);
    const newIds  = already
      ? current.filter((sid: string) => sid !== id)
      : [...current, id];
    set({ savedIds: newIds });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIds)).catch(() => {});
  },

  isSaved: (id: string) => get().savedIds.includes(id),
}));

export type { SavedStore };