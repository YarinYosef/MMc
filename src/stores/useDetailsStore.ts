'use client';

import { create } from 'zustand';

export type DetailsSection = 'fundamentals' | 'financials' | 'volume' | 'options' | 'orderbook' | 'insider' | 'newsprice';

export const DEFAULT_SECTION_ORDER: DetailsSection[] = [
  'fundamentals',
  'financials',
  'volume',
  'options',
  'orderbook',
  'insider',
  'newsprice',
];

interface SectionState {
  minimized: boolean;
}

interface DetailsStoreState {
  selectedSymbol: string | null;
  sectionOrder: DetailsSection[];
  sectionStates: Record<DetailsSection, SectionState>;
  expandedChart: { section: DetailsSection; chartId: string } | null;

  // Actions
  setSelectedSymbol: (symbol: string | null) => void;
  toggleSection: (section: DetailsSection) => void;
  setSectionOrder: (order: DetailsSection[]) => void;
  setExpandedChart: (chart: { section: DetailsSection; chartId: string } | null) => void;
}

export const useDetailsStore = create<DetailsStoreState>((set) => ({
  selectedSymbol: 'MSFT',
  sectionOrder: DEFAULT_SECTION_ORDER,
  sectionStates: {
    fundamentals: { minimized: false },
    financials: { minimized: false },
    volume: { minimized: false },
    options: { minimized: false },
    orderbook: { minimized: false },
    insider: { minimized: false },
    newsprice: { minimized: false },
  },
  expandedChart: null,

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  toggleSection: (section) =>
    set((state) => ({
      sectionStates: {
        ...state.sectionStates,
        [section]: { minimized: !state.sectionStates[section].minimized },
      },
    })),

  setSectionOrder: (order) => set({ sectionOrder: order }),

  setExpandedChart: (chart) => set({ expandedChart: chart }),
}));
