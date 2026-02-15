import { render, screen, fireEvent } from '@testing-library/react';
import { MoneyMaps } from '@/components/moneymap/MoneyMaps';
import { useOnionStore } from '@/stores/useOnionStore';

// Mock all sub-components to avoid recharts/d3 complexity
jest.mock('@/components/moneymap/maps/CrossAssetRotation', () => ({
  CrossAssetRotation: () => <div data-testid="cross-asset-map">Cross-Asset Map</div>,
}));
jest.mock('@/components/moneymap/maps/SectorRotation', () => ({
  SectorRotation: () => <div data-testid="sector-map">Sector Map</div>,
}));
jest.mock('@/components/moneymap/maps/SubSectorRotation', () => ({
  SubSectorRotation: () => <div data-testid="sub-sector-map">Sub-Sector Map</div>,
}));
jest.mock('@/components/moneymap/maps/FactorStyleRotation', () => ({
  FactorStyleRotation: () => <div data-testid="factor-map">Factor Map</div>,
}));
jest.mock('@/components/moneymap/maps/StockSelection', () => ({
  StockSelection: () => <div data-testid="stock-map">Stock Map</div>,
}));
jest.mock('@/components/moneymap/guidance/InsiderBuybackFlow', () => ({
  InsiderBuybackFlow: () => <div data-testid="insider-flow">Insider Flow</div>,
}));
jest.mock('@/components/moneymap/guidance/NewsPriceReaction', () => ({
  NewsPriceReaction: () => <div data-testid="news-price">News Price</div>,
}));
jest.mock('@/components/moneymap/support/HedgeMap', () => ({
  HedgeMap: () => <div data-testid="hedge-map">Hedge Map</div>,
}));
jest.mock('@/components/moneymap/support/CalendarOverlay', () => ({
  CalendarOverlay: () => <div data-testid="calendar">Calendar</div>,
}));
jest.mock('@/components/moneymap/support/SocialSentimentOverlay', () => ({
  SocialSentimentOverlay: () => <div data-testid="sentiment">Sentiment</div>,
}));

beforeEach(() => {
  useOnionStore.setState({
    selectedRing: null,
    selectedSegment: null,
    hoveredSegment: null,
    timeframe: '1D',
    drillPath: [],
    rotation: 0,
    activeMoneyMap: 'cross-asset',
  });
});

describe('MoneyMaps', () => {
  it('renders the widget container', () => {
    render(<MoneyMaps />);
    expect(document.getElementById('money-maps')).toBeInTheDocument();
  });

  it('renders map type tabs', () => {
    render(<MoneyMaps />);
    expect(screen.getByText('Cross-Asset')).toBeInTheDocument();
    expect(screen.getByText('Sector')).toBeInTheDocument();
    expect(screen.getByText('Sub-Sector')).toBeInTheDocument();
    expect(screen.getByText('Factor')).toBeInTheDocument();
    expect(screen.getByText('Stocks')).toBeInTheDocument();
  });

  it('renders layer tabs', () => {
    render(<MoneyMaps />);
    expect(screen.getByText('Maps')).toBeInTheDocument();
    expect(screen.getByText('Guidance')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('clicking tab changes active money map', () => {
    render(<MoneyMaps />);
    fireEvent.click(screen.getByText('Sector'));
    expect(useOnionStore.getState().activeMoneyMap).toBe('sector');
  });

  it('shows cross-asset content by default', () => {
    render(<MoneyMaps />);
    expect(screen.getByTestId('cross-asset-map')).toBeInTheDocument();
  });

  it('switching to factor shows factor content', () => {
    useOnionStore.setState({ activeMoneyMap: 'factor-style' });
    render(<MoneyMaps />);
    expect(screen.getByTestId('factor-map')).toBeInTheDocument();
  });

  it('switching to guidance layer shows insider flow by default', () => {
    render(<MoneyMaps />);
    fireEvent.click(screen.getByText('Guidance'));
    expect(screen.getByTestId('insider-flow')).toBeInTheDocument();
  });

  it('switching to support layer shows hedge map by default', () => {
    render(<MoneyMaps />);
    fireEvent.click(screen.getByText('Support'));
    expect(screen.getByTestId('hedge-map')).toBeInTheDocument();
  });
});
