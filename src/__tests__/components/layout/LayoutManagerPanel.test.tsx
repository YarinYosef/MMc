import { render, screen, fireEvent } from '@testing-library/react';
import { LayoutManagerPanel } from '@/components/layout/LayoutManagerPanel';
import { useLayoutStore } from '@/stores/useLayoutStore';

// Mock framer-motion to render children directly
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      className,
      onClick,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => {
      // Filter out framer-motion specific props
      const { initial, animate, exit, transition, ...htmlProps } = rest;
      void initial; void animate; void exit; void transition;
      return (
        <div className={className} onClick={onClick} {...htmlProps}>
          {children}
        </div>
      );
    },
  },
}));

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
    layoutManagerOpen: true,
  });
});

describe('LayoutManagerPanel', () => {
  it('renders header when open', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByText('Layout Manager')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    useLayoutStore.setState({ layoutManagerOpen: false });
    const { container } = render(<LayoutManagerPanel />);
    expect(container.textContent).toBe('');
  });

  it('shows Default Layout in the list', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByText('Default Layout')).toBeInTheDocument();
  });

  it('shows widget visibility section', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByText('Widget Visibility')).toBeInTheDocument();
  });

  it('lists all widget types', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByText('compass')).toBeInTheDocument();
    expect(screen.getByText('onion')).toBeInTheDocument();
    expect(screen.getByText('moneymap')).toBeInTheDocument();
    expect(screen.getByText('details')).toBeInTheDocument();
    expect(screen.getByText('news')).toBeInTheDocument();
    expect(screen.getByText('watchlist')).toBeInTheDocument();
  });

  it('has save input and button', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByPlaceholderText('New layout name...')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows custom layout counter', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByText(/0\/4 custom layouts/)).toBeInTheDocument();
  });

  it('saves a new layout via input', () => {
    render(<LayoutManagerPanel />);
    const input = screen.getByPlaceholderText('New layout name...');
    fireEvent.change(input, { target: { value: 'My Layout' } });
    fireEvent.click(screen.getByText('Save'));
    expect(useLayoutStore.getState().savedLayouts).toHaveLength(2);
    expect(useLayoutStore.getState().savedLayouts[1].name).toBe('My Layout');
  });

  it('shows ESC hint in footer', () => {
    render(<LayoutManagerPanel />);
    expect(screen.getByText(/Press ESC to toggle/)).toBeInTheDocument();
  });

  it('toggles widget visibility when clicked', () => {
    render(<LayoutManagerPanel />);
    const compassBtn = screen.getByText('compass');
    fireEvent.click(compassBtn);
    const layout = useLayoutStore.getState().savedLayouts.find(
      (l) => l.id === 'default'
    );
    const compassWidget = layout?.widgets.find((w) => w.type === 'compass');
    expect(compassWidget?.visible).toBe(false);
  });
});
