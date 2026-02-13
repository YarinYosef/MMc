import { render, screen, fireEvent } from '@testing-library/react';
import { NotesEditor } from '@/components/manage/NotesEditor';
import { useDetailsStore } from '@/stores/useDetailsStore';

// Mock storageEngine
jest.mock('@/lib/storageEngine', () => ({
  loadFromStorage: jest.fn().mockReturnValue(null),
  saveToStorage: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-' + Math.random().toString(36).slice(2, 8)),
}));

beforeEach(() => {
  useDetailsStore.setState({ selectedSymbol: 'AAPL' });
});

describe('NotesEditor', () => {
  it('renders empty state', () => {
    render(<NotesEditor />);
    expect(screen.getByText(/No notes yet/)).toBeInTheDocument();
  });

  it('shows note count', () => {
    render(<NotesEditor />);
    expect(screen.getByText(/0 notes/)).toBeInTheDocument();
  });

  it('shows selected symbol', () => {
    render(<NotesEditor />);
    expect(screen.getByText('(AAPL)')).toBeInTheDocument();
  });

  it('has New Note button', () => {
    render(<NotesEditor />);
    expect(screen.getByText('+ New Note')).toBeInTheDocument();
  });

  it('creates a new note on button click', () => {
    render(<NotesEditor />);
    fireEvent.click(screen.getByText('+ New Note'));
    // Should show editing textarea
    expect(screen.getByPlaceholderText('Write your note...')).toBeInTheDocument();
    // Note count should update
    expect(screen.getByText(/1 note/)).toBeInTheDocument();
  });

  it('can save a note', () => {
    render(<NotesEditor />);
    fireEvent.click(screen.getByText('+ New Note'));
    const textarea = screen.getByPlaceholderText('Write your note...');
    fireEvent.change(textarea, { target: { value: 'Test note content' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('Test note content')).toBeInTheDocument();
  });

  it('can cancel editing a note', () => {
    render(<NotesEditor />);
    fireEvent.click(screen.getByText('+ New Note'));
    expect(screen.getByPlaceholderText('Write your note...')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    // Should no longer be editing
    expect(screen.queryByPlaceholderText('Write your note...')).not.toBeInTheDocument();
  });

  it('can delete a note', () => {
    render(<NotesEditor />);
    fireEvent.click(screen.getByText('+ New Note'));
    const textarea = screen.getByPlaceholderText('Write your note...');
    fireEvent.change(textarea, { target: { value: 'To be deleted' } });
    fireEvent.click(screen.getByText('Save'));
    expect(screen.getByText('To be deleted')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Del'));
    expect(screen.queryByText('To be deleted')).not.toBeInTheDocument();
    expect(screen.getByText(/0 notes/)).toBeInTheDocument();
  });
});
