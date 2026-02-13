import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduledAlerts } from '@/components/manage/ScheduledAlerts';
import { useDetailsStore } from '@/stores/useDetailsStore';

// Mock storageEngine
jest.mock('@/lib/storageEngine', () => ({
  loadFromStorage: jest.fn().mockReturnValue(null),
  saveToStorage: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'alert-uuid-' + Math.random().toString(36).slice(2, 8)),
}));

// Mock notificationEngine
jest.mock('@/lib/notificationEngine', () => ({
  notify: jest.fn(),
}));

// Mock useMarketStore
jest.mock('@/stores/useMarketStore', () => ({
  useMarketStore: jest.fn((selector) =>
    selector({ tickers: new Map(), indices: [], selectedTicker: 'MSFT', isRunning: false })
  ),
}));

beforeEach(() => {
  useDetailsStore.setState({ selectedSymbol: 'MSFT' });
});

describe('ScheduledAlerts', () => {
  it('renders empty state', () => {
    render(<ScheduledAlerts />);
    expect(screen.getByText(/No alerts set/)).toBeInTheDocument();
  });

  it('shows stats with zero counts', () => {
    render(<ScheduledAlerts />);
    expect(screen.getByText(/0 active \/ 0 total/)).toBeInTheDocument();
  });

  it('has ticker input with placeholder from selected symbol', () => {
    render(<ScheduledAlerts />);
    expect(screen.getByPlaceholderText('MSFT')).toBeInTheDocument();
  });

  it('has condition dropdown with all options', () => {
    render(<ScheduledAlerts />);
    expect(screen.getByText('Price Above')).toBeInTheDocument();
  });

  it('has value input and Set button', () => {
    render(<ScheduledAlerts />);
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument();
    expect(screen.getByText('Set')).toBeInTheDocument();
  });

  it('Set button is disabled when value is empty', () => {
    render(<ScheduledAlerts />);
    expect(screen.getByText('Set')).toBeDisabled();
  });

  it('adds an alert', () => {
    render(<ScheduledAlerts />);
    const tickerInput = screen.getByPlaceholderText('MSFT');
    const valueInput = screen.getByPlaceholderText('Value');

    fireEvent.change(tickerInput, { target: { value: 'AAPL' } });
    fireEvent.change(valueInput, { target: { value: '200' } });
    fireEvent.click(screen.getByText('Set'));

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText(/1 active \/ 1 total/)).toBeInTheDocument();
  });

  it('uses selected symbol when ticker input is empty', () => {
    render(<ScheduledAlerts />);
    const valueInput = screen.getByPlaceholderText('Value');
    fireEvent.change(valueInput, { target: { value: '150' } });
    fireEvent.click(screen.getByText('Set'));
    expect(screen.getByText('MSFT')).toBeInTheDocument();
  });

  it('can delete an alert', () => {
    render(<ScheduledAlerts />);
    const valueInput = screen.getByPlaceholderText('Value');
    fireEvent.change(valueInput, { target: { value: '300' } });
    fireEvent.click(screen.getByText('Set'));
    expect(screen.getByText(/1 active/)).toBeInTheDocument();

    // Click the delete button (x)
    fireEvent.click(screen.getByText('x'));
    expect(screen.getByText(/0 active \/ 0 total/)).toBeInTheDocument();
  });
});
