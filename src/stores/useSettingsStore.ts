'use client';

import { create } from 'zustand';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';

interface UserSettings {
  theme: 'dark'; // dark only for this dashboard
  updateSpeed: 'fast' | 'normal' | 'slow';
  showTooltips: boolean;
  animationsEnabled: boolean;
  newsAutoScroll: boolean;
  defaultTimeframe: string;
  compassLayerFilter: string;
  soundEnabled: boolean;
}

interface SettingsStoreState extends UserSettings {
  setUpdateSpeed: (speed: UserSettings['updateSpeed']) => void;
  toggleTooltips: () => void;
  toggleAnimations: () => void;
  toggleNewsAutoScroll: () => void;
  setDefaultTimeframe: (tf: string) => void;
  toggleSound: () => void;
  loadSettings: () => void;
  saveSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  updateSpeed: 'normal',
  showTooltips: true,
  animationsEnabled: true,
  newsAutoScroll: true,
  defaultTimeframe: '1D',
  compassLayerFilter: 'all',
  soundEnabled: false,
};

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  setUpdateSpeed: (speed) => {
    set({ updateSpeed: speed });
    get().saveSettings();
  },

  toggleTooltips: () => {
    set((state) => ({ showTooltips: !state.showTooltips }));
    get().saveSettings();
  },

  toggleAnimations: () => {
    set((state) => ({ animationsEnabled: !state.animationsEnabled }));
    get().saveSettings();
  },

  toggleNewsAutoScroll: () => {
    set((state) => ({ newsAutoScroll: !state.newsAutoScroll }));
    get().saveSettings();
  },

  setDefaultTimeframe: (tf) => {
    set({ defaultTimeframe: tf });
    get().saveSettings();
  },

  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
    get().saveSettings();
  },

  loadSettings: () => {
    const saved = loadFromStorage<UserSettings>('settings');
    if (saved) {
      set({ ...DEFAULT_SETTINGS, ...saved });
    }
  },

  saveSettings: () => {
    const state = get();
    const settings: UserSettings = {
      theme: state.theme,
      updateSpeed: state.updateSpeed,
      showTooltips: state.showTooltips,
      animationsEnabled: state.animationsEnabled,
      newsAutoScroll: state.newsAutoScroll,
      defaultTimeframe: state.defaultTimeframe,
      compassLayerFilter: state.compassLayerFilter,
      soundEnabled: state.soundEnabled,
    };
    saveToStorage('settings', settings);
  },
}));
