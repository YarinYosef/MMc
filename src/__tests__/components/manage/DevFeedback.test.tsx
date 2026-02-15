import { render, screen, fireEvent } from '@testing-library/react';
import { DevFeedback } from '@/components/manage/DevFeedback';

// Mock storageEngine
jest.mock('@/lib/storageEngine', () => ({
  loadFromStorage: jest.fn().mockReturnValue(null),
  saveToStorage: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'fb-uuid-' + Math.random().toString(36).slice(2, 8)),
}));

describe('DevFeedback', () => {
  it('renders empty state', () => {
    render(<DevFeedback />);
    expect(screen.getByText(/No feedback submitted yet/)).toBeInTheDocument();
  });

  it('shows open issues count', () => {
    render(<DevFeedback />);
    expect(screen.getByText(/0 open issues/)).toBeInTheDocument();
  });

  it('has Report Issue button', () => {
    render(<DevFeedback />);
    expect(screen.getByText('+ Report Issue')).toBeInTheDocument();
  });

  it('toggles add form on button click', () => {
    render(<DevFeedback />);
    fireEvent.click(screen.getByText('+ Report Issue'));
    expect(screen.getByPlaceholderText('Title...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe the issue or suggestion...')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    // Button changes to Cancel
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('Submit is disabled when title is empty', () => {
    render(<DevFeedback />);
    fireEvent.click(screen.getByText('+ Report Issue'));
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('submits feedback', () => {
    render(<DevFeedback />);
    fireEvent.click(screen.getByText('+ Report Issue'));

    const titleInput = screen.getByPlaceholderText('Title...');
    const descInput = screen.getByPlaceholderText('Describe the issue or suggestion...');

    fireEvent.change(titleInput, { target: { value: 'Chart bug' } });
    fireEvent.change(descInput, { target: { value: 'Chart does not load' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Chart bug')).toBeInTheDocument();
    expect(screen.getByText('Chart does not load')).toBeInTheDocument();
    expect(screen.getByText(/1 open issues/)).toBeInTheDocument();
  });

  it('shows severity badge and type label', () => {
    render(<DevFeedback />);
    fireEvent.click(screen.getByText('+ Report Issue'));
    fireEvent.change(screen.getByPlaceholderText('Title...'), {
      target: { value: 'Test issue' },
    });
    fireEvent.click(screen.getByText('Submit'));

    // Default type is Bug, severity is medium
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('can delete a feedback entry', () => {
    render(<DevFeedback />);
    fireEvent.click(screen.getByText('+ Report Issue'));
    fireEvent.change(screen.getByPlaceholderText('Title...'), {
      target: { value: 'To delete' },
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('To delete')).toBeInTheDocument();

    fireEvent.click(screen.getByText('x'));
    expect(screen.queryByText('To delete')).not.toBeInTheDocument();
    expect(screen.getByText(/0 open issues/)).toBeInTheDocument();
  });

  it('closes form on Cancel', () => {
    render(<DevFeedback />);
    fireEvent.click(screen.getByText('+ Report Issue'));
    expect(screen.getByPlaceholderText('Title...')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Title...')).not.toBeInTheDocument();
  });
});
