import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationSettings } from '@/components/watchlist/NotificationSettings';
import { useWatchlistStore } from '@/stores/useWatchlistStore';

// Mock notificationEngine
jest.mock('@/lib/notificationEngine', () => ({
  requestNotificationPermission: jest.fn().mockResolvedValue(true),
}));

const onClose = jest.fn();

beforeEach(() => {
  onClose.mockClear();
  useWatchlistStore.setState({
    groups: [
      {
        id: 'g1',
        name: 'Tech Watchlist',
        color: '#3B82F6',
        createdAt: Date.now(),
        sortOrder: 0,
        items: [
          { symbol: 'AAPL', type: 'ticker' as const, subscribedToNews: true, addedAt: Date.now() },
          { symbol: 'GOOG', type: 'ticker' as const, subscribedToNews: false, addedAt: Date.now() },
        ],
      },
    ],
    contactInfo: { emailAddress: '', phoneNumber: '' },
    notificationPrefs: [],
  });
});

describe('NotificationSettings', () => {
  it('renders header', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  it('has email and phone inputs', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 (555) 123-4567')).toBeInTheDocument();
  });

  it('has contact info section', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  it('has per-watchlist settings section', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Per-Watchlist Settings')).toBeInTheDocument();
  });

  it('shows watchlist group name', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Tech Watchlist')).toBeInTheDocument();
  });

  it('shows subscribed count', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('1 subscribed')).toBeInTheDocument();
  });

  it('has channel toggle checkboxes', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('In-App')).toBeInTheDocument();
  });

  it('has frequency buttons', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('immediate')).toBeInTheDocument();
    expect(screen.getByText('hourly')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
  });

  it('has Save Contact Info button', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Save Contact Info')).toBeInTheDocument();
  });

  it('has enable browser notifications link', () => {
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('Enable browser notifications')).toBeInTheDocument();
  });

  it('validates invalid email on save', () => {
    render(<NotificationSettings onClose={onClose} />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByText('Save Contact Info'));
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('validates invalid phone on save', () => {
    render(<NotificationSettings onClose={onClose} />);
    const phoneInput = screen.getByPlaceholderText('+1 (555) 123-4567');
    fireEvent.change(phoneInput, { target: { value: '12' } });
    fireEvent.click(screen.getByText('Save Contact Info'));
    expect(screen.getByText('Invalid phone format')).toBeInTheDocument();
  });

  it('shows no watchlists message when empty', () => {
    useWatchlistStore.setState({ groups: [] });
    render(<NotificationSettings onClose={onClose} />);
    expect(screen.getByText('No watchlists created yet.')).toBeInTheDocument();
  });

  it('close button calls onClose', () => {
    render(<NotificationSettings onClose={onClose} />);
    // The close button is the SVG button in the header
    const closeButtons = document.querySelectorAll('button');
    // First button in the header
    const headerCloseBtn = closeButtons[0];
    fireEvent.click(headerCloseBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
