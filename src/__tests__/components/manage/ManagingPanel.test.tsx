import { render, screen, fireEvent } from '@testing-library/react';
import { ManagingPanel } from '@/components/manage/ManagingPanel';
import { useLayoutStore } from '@/stores/useLayoutStore';

// Mock sub-components
jest.mock('@/components/manage/NotesEditor', () => ({
  NotesEditor: () => <div data-testid="notes-editor">Notes Editor</div>,
}));
jest.mock('@/components/manage/TodoList', () => ({
  TodoList: () => <div data-testid="todo-list">Todo List</div>,
}));
jest.mock('@/components/manage/ScheduledAlerts', () => ({
  ScheduledAlerts: () => <div data-testid="scheduled-alerts">Scheduled Alerts</div>,
}));
jest.mock('@/components/manage/DevFeedback', () => ({
  DevFeedback: () => <div data-testid="dev-feedback">Dev Feedback</div>,
}));

beforeEach(() => {
  useLayoutStore.setState({
    managingPane: {
      isOpen: true,
      activeTab: 'notes',
    },
  });
});

describe('ManagingPanel', () => {
  it('renders title', () => {
    render(<ManagingPanel />);
    expect(screen.getByText('Managing Panel')).toBeInTheDocument();
  });

  it('renders all 4 tabs', () => {
    render(<ManagingPanel />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Todo')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  it('shows notes editor by default', () => {
    render(<ManagingPanel />);
    expect(screen.getByTestId('notes-editor')).toBeInTheDocument();
  });

  it('switching to Todo tab shows todo content', () => {
    render(<ManagingPanel />);
    fireEvent.click(screen.getByText('Todo'));
    expect(useLayoutStore.getState().managingPane.activeTab).toBe('todo');
  });

  it('switching to Alerts tab changes active tab', () => {
    render(<ManagingPanel />);
    fireEvent.click(screen.getByText('Alerts'));
    expect(useLayoutStore.getState().managingPane.activeTab).toBe('alerts');
  });

  it('switching to Feedback tab changes active tab', () => {
    render(<ManagingPanel />);
    fireEvent.click(screen.getByText('Feedback'));
    expect(useLayoutStore.getState().managingPane.activeTab).toBe('feedback');
  });

  it('shows Shift+Space hint in footer', () => {
    render(<ManagingPanel />);
    expect(screen.getByText(/Shift\+Space/)).toBeInTheDocument();
  });
});
