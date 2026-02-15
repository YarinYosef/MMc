import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '@/components/manage/TodoList';

// Mock storageEngine
jest.mock('@/lib/storageEngine', () => ({
  loadFromStorage: jest.fn().mockReturnValue(null),
  saveToStorage: jest.fn(),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'todo-uuid-' + Math.random().toString(36).slice(2, 8)),
}));

describe('TodoList', () => {
  it('renders empty state', () => {
    render(<TodoList />);
    expect(screen.getByText(/No tasks yet/)).toBeInTheDocument();
  });

  it('shows stats with zero counts', () => {
    render(<TodoList />);
    expect(screen.getByText(/0 pending, 0 done/)).toBeInTheDocument();
  });

  it('has input and Add button', () => {
    render(<TodoList />);
    expect(screen.getByPlaceholderText('Add a task...')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('Add button is disabled when input is empty', () => {
    render(<TodoList />);
    expect(screen.getByText('Add')).toBeDisabled();
  });

  it('adds a todo item', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...');
    fireEvent.change(input, { target: { value: 'Buy groceries' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText(/1 pending, 0 done/)).toBeInTheDocument();
  });

  it('adds a todo via Enter key', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...');
    fireEvent.change(input, { target: { value: 'Read a book' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Read a book')).toBeInTheDocument();
  });

  it('clears input after adding', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Exercise' } });
    fireEvent.click(screen.getByText('Add'));
    expect(input.value).toBe('');
  });

  it('toggles a todo completed', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...');
    fireEvent.change(input, { target: { value: 'Finish report' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText(/1 pending, 0 done/)).toBeInTheDocument();
    // Click the checkbox (first button in the todo item row)
    const todoText = screen.getByText('Finish report');
    const todoRow = todoText.closest('div[class*="flex items-center"]');
    const checkbox = todoRow?.querySelector('button');
    if (checkbox) fireEvent.click(checkbox);
    expect(screen.getByText(/0 pending, 1 done/)).toBeInTheDocument();
  });

  it('shows Clear completed button when there are completed items', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...');
    fireEvent.change(input, { target: { value: 'Task 1' } });
    fireEvent.click(screen.getByText('Add'));
    // Complete the task
    const todoText = screen.getByText('Task 1');
    const todoRow = todoText.closest('div[class*="flex items-center"]');
    const checkbox = todoRow?.querySelector('button');
    if (checkbox) fireEvent.click(checkbox);
    expect(screen.getByText('Clear completed')).toBeInTheDocument();
  });

  it('clears completed items', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...');

    // Add two items
    fireEvent.change(input, { target: { value: 'Task A' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.change(input, { target: { value: 'Task B' } });
    fireEvent.click(screen.getByText('Add'));

    // Complete Task A
    const taskA = screen.getByText('Task A');
    const rowA = taskA.closest('div[class*="flex items-center"]');
    const checkboxA = rowA?.querySelector('button');
    if (checkboxA) fireEvent.click(checkboxA);

    // Clear completed
    fireEvent.click(screen.getByText('Clear completed'));
    expect(screen.queryByText('Task A')).not.toBeInTheDocument();
    expect(screen.getByText('Task B')).toBeInTheDocument();
    expect(screen.getByText(/1 pending, 0 done/)).toBeInTheDocument();
  });

  it('does not add empty todo', () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Add a task...');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText(/0 pending, 0 done/)).toBeInTheDocument();
  });
});
