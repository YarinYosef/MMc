import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';

// Mock all child layout components
jest.mock('@/components/layout/LayoutManager', () => ({
  LayoutManager: () => <div data-testid="layout-manager">Layout Manager</div>,
}));
jest.mock('@/components/layout/LayoutManagerPanel', () => ({
  LayoutManagerPanel: () => <div data-testid="layout-manager-panel" />,
}));
jest.mock('@/components/layout/RatingOverlay', () => ({
  RatingOverlay: () => <div data-testid="rating-overlay" />,
}));
jest.mock('@/components/layout/WindowManager', () => ({
  WindowManager: () => <div data-testid="window-manager" />,
}));
jest.mock('@/components/watchlist/NotificationToastBridge', () => ({
  NotificationToastBridge: () => <div data-testid="toast-bridge" />,
}));

const SLOT_PROPS = {
  compassBar: <div data-testid="compass-bar">Compass Bar</div>,
  onionChart: <div data-testid="onion-chart">Onion Chart</div>,
  moneyMaps: <div data-testid="money-maps">Money Maps</div>,
  detailsPanel: <div data-testid="details-panel">Details Panel</div>,
  newsFeed: <div data-testid="news-feed">News Feed</div>,
  watchlistPanel: <div data-testid="watchlist-panel">Watchlist Panel</div>,
  managingPanel: <div data-testid="managing-panel">Managing Panel</div>,
};

beforeEach(() => {
  useLayoutStore.setState({
    currentLayoutId: 'default',
    savedLayouts: [
      {
        id: 'default',
        name: 'Default Layout',
        createdAt: Date.now(),
        widgets: [
          { id: 'compass-bar', type: 'compass', order: 0, visible: true },
          { id: 'onion-chart', type: 'onion', order: 1, visible: true },
          { id: 'money-maps', type: 'moneymap', order: 2, visible: true },
          { id: 'details-panel', type: 'details', order: 3, visible: true },
          { id: 'news-feed', type: 'news', order: 4, visible: true },
          { id: 'watchlist', type: 'watchlist', order: 5, visible: true },
        ],
        newsHeightPercent: 8,
        detachedWindows: [],
      },
    ],
    managingPane: { isOpen: false, activeTab: 'notes' },
    windows: [],
  });
  useWatchlistStore.setState({ isOpen: true });
});

describe('DashboardLayout', () => {
  it('renders MMC DASHBOARD header', () => {
    render(<DashboardLayout {...SLOT_PROPS} />);
    expect(screen.getByText('MMC DASHBOARD')).toBeInTheDocument();
  });

  it('renders all widget slots', () => {
    render(<DashboardLayout {...SLOT_PROPS} />);
    expect(screen.getByTestId('compass-bar')).toBeInTheDocument();
    expect(screen.getByTestId('onion-chart')).toBeInTheDocument();
    expect(screen.getByTestId('money-maps')).toBeInTheDocument();
    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
    expect(screen.getByTestId('news-feed')).toBeInTheDocument();
    expect(screen.getByTestId('watchlist-panel')).toBeInTheDocument();
  });

  it('renders internal components', () => {
    render(<DashboardLayout {...SLOT_PROPS} />);
    expect(screen.getByTestId('window-manager')).toBeInTheDocument();
    expect(screen.getByTestId('layout-manager-panel')).toBeInTheDocument();
    expect(screen.getByTestId('rating-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('layout-manager')).toBeInTheDocument();
    expect(screen.getByTestId('toast-bridge')).toBeInTheDocument();
  });

  it('does not show managing panel when closed', () => {
    render(<DashboardLayout {...SLOT_PROPS} />);
    expect(screen.queryByTestId('managing-panel')).not.toBeInTheDocument();
  });

  it('shows managing panel when open', () => {
    useLayoutStore.setState({
      managingPane: { isOpen: true, activeTab: 'notes' },
    });
    render(<DashboardLayout {...SLOT_PROPS} />);
    expect(screen.getByTestId('managing-panel')).toBeInTheDocument();
  });

  it('has watchlist toggle button', () => {
    render(<DashboardLayout {...SLOT_PROPS} />);
    const toggleBtn = screen.getByTitle('Close watchlist');
    expect(toggleBtn).toBeInTheDocument();
  });

  it('toggles watchlist via hamburger button', () => {
    render(<DashboardLayout {...SLOT_PROPS} />);
    const toggleBtn = screen.getByTitle('Close watchlist');
    fireEvent.click(toggleBtn);
    expect(useWatchlistStore.getState().isOpen).toBe(false);
  });

  it('hides compass when widget is not visible', () => {
    useLayoutStore.setState({
      savedLayouts: [
        {
          id: 'default',
          name: 'Default Layout',
          createdAt: Date.now(),
          widgets: [
            { id: 'compass-bar', type: 'compass', order: 0, visible: false },
            { id: 'onion-chart', type: 'onion', order: 1, visible: true },
            { id: 'money-maps', type: 'moneymap', order: 2, visible: true },
            { id: 'details-panel', type: 'details', order: 3, visible: true },
            { id: 'news-feed', type: 'news', order: 4, visible: true },
            { id: 'watchlist', type: 'watchlist', order: 5, visible: true },
          ],
          newsHeightPercent: 8,
          detachedWindows: [],
        },
      ],
    });
    render(<DashboardLayout {...SLOT_PROPS} />);
    expect(screen.queryByTestId('compass-bar')).not.toBeInTheDocument();
  });
});
