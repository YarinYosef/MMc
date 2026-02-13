import { render, screen, fireEvent } from '@testing-library/react';
import { OnionChart } from '@/components/onion/OnionChart';
import { useOnionStore } from '@/stores/useOnionStore';

// Mock Radix components
jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Trigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Content: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
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

describe('OnionChart', () => {
  it('renders with title', () => {
    render(<OnionChart />);
    expect(screen.getByText('Onion Chart')).toBeInTheDocument();
  });

  it('renders timeframe buttons (1D, 1W, 1M)', () => {
    render(<OnionChart />);
    expect(screen.getByText('1D')).toBeInTheDocument();
    expect(screen.getByText('1W')).toBeInTheDocument();
    expect(screen.getByText('1M')).toBeInTheDocument();
  });

  it('clicking timeframe changes store state', () => {
    render(<OnionChart />);
    fireEvent.click(screen.getByText('1W'));
    expect(useOnionStore.getState().timeframe).toBe('1W');
  });

  it('shows Reset button when drillPath is non-empty', () => {
    useOnionStore.setState({ drillPath: ['level-1'] });
    render(<OnionChart />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('does not show Reset button when drillPath is empty', () => {
    render(<OnionChart />);
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('Reset button clears drill path', () => {
    useOnionStore.setState({ drillPath: ['level-1', 'level-2'], selectedSegment: 'level-2' });
    render(<OnionChart />);
    fireEvent.click(screen.getByText('Reset'));
    expect(useOnionStore.getState().drillPath).toEqual([]);
    expect(useOnionStore.getState().selectedSegment).toBeNull();
  });

  it('shows Back button when drillPath has 2+ levels', () => {
    useOnionStore.setState({ drillPath: ['level-1', 'level-2'] });
    render(<OnionChart />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('does not show Back button when drillPath has 1 level', () => {
    useOnionStore.setState({ drillPath: ['level-1'] });
    render(<OnionChart />);
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });
});
