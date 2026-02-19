import { useDetailsStore, DEFAULT_SECTION_ORDER } from '@/stores/useDetailsStore';
import type { DetailsSection } from '@/stores/useDetailsStore';

beforeEach(() => {
  useDetailsStore.setState({
    selectedSymbol: 'MSFT',
    sectionOrder: [...DEFAULT_SECTION_ORDER],
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
  });
});

describe('useDetailsStore', () => {
  it('starts with default symbol', () => {
    expect(useDetailsStore.getState().selectedSymbol).toBe('MSFT');
  });

  it('sets selected symbol', () => {
    useDetailsStore.getState().setSelectedSymbol('AAPL');
    expect(useDetailsStore.getState().selectedSymbol).toBe('AAPL');
  });

  it('can set symbol to null', () => {
    useDetailsStore.getState().setSelectedSymbol(null);
    expect(useDetailsStore.getState().selectedSymbol).toBeNull();
  });

  it('toggles section minimized state', () => {
    useDetailsStore.getState().toggleSection('options');
    expect(useDetailsStore.getState().sectionStates.options.minimized).toBe(true);
    useDetailsStore.getState().toggleSection('options');
    expect(useDetailsStore.getState().sectionStates.options.minimized).toBe(false);
  });

  it('sets section order', () => {
    const newOrder: DetailsSection[] = ['insider', 'options', 'fundamentals', 'financials', 'volume', 'newsprice'];
    useDetailsStore.getState().setSectionOrder(newOrder);
    expect(useDetailsStore.getState().sectionOrder).toEqual(newOrder);
  });

  it('sets expanded chart', () => {
    useDetailsStore.getState().setExpandedChart({ section: 'financials', chartId: 'revenue-chart' });
    expect(useDetailsStore.getState().expandedChart).toEqual({ section: 'financials', chartId: 'revenue-chart' });
  });

  it('clears expanded chart', () => {
    useDetailsStore.getState().setExpandedChart({ section: 'financials', chartId: 'revenue-chart' });
    useDetailsStore.getState().setExpandedChart(null);
    expect(useDetailsStore.getState().expandedChart).toBeNull();
  });

  it('has all 6 sortable sections in default order (orderbook is pinned)', () => {
    expect(useDetailsStore.getState().sectionOrder).toHaveLength(6);
    expect(useDetailsStore.getState().sectionOrder).toEqual(DEFAULT_SECTION_ORDER);
    expect(useDetailsStore.getState().sectionOrder).not.toContain('orderbook');
  });
});
