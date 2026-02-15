import { render, screen, fireEvent } from '@testing-library/react';
import { RatingOverlay } from '@/components/layout/RatingOverlay';
import { useLayoutStore } from '@/stores/useLayoutStore';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      className,
      onClick,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => {
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

// Mock storageEngine so RatingOverlay works without localStorage
jest.mock('@/lib/storageEngine', () => ({
  loadFromStorage: jest.fn().mockReturnValue(null),
  saveToStorage: jest.fn(),
}));

beforeEach(() => {
  useLayoutStore.setState({
    ratingOverlayOpen: true,
  });
});

describe('RatingOverlay', () => {
  it('renders title when open', () => {
    render(<RatingOverlay />);
    expect(screen.getByText('Rate Importance')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    useLayoutStore.setState({ ratingOverlayOpen: false });
    const { container } = render(<RatingOverlay />);
    expect(container.textContent).toBe('');
  });

  it('shows 10 rating buttons', () => {
    render(<RatingOverlay />);
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('shows scale labels', () => {
    render(<RatingOverlay />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows Cancel and Submit buttons', () => {
    render(<RatingOverlay />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('shows daily limit counter', () => {
    render(<RatingOverlay />);
    expect(screen.getByText(/0\/3 today/)).toBeInTheDocument();
  });

  it('shows shift+right-click hint', () => {
    render(<RatingOverlay />);
    expect(screen.getByText(/Shift \+ Right-click to toggle/)).toBeInTheDocument();
  });

  it('Cancel closes the overlay', () => {
    render(<RatingOverlay />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(useLayoutStore.getState().ratingOverlayOpen).toBe(false);
  });

  it('clicking a rating number selects it', () => {
    render(<RatingOverlay />);
    const btn7 = screen.getByText('7');
    fireEvent.click(btn7);
    // Submit should now be enabled (we can verify by clicking it)
    const submitBtn = screen.getByText('Submit');
    expect(submitBtn).not.toBeDisabled();
  });
});
