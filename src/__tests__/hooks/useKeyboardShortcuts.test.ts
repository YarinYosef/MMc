import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';

beforeEach(() => {
  useLayoutStore.setState({
    managingPane: { isOpen: false, activeTab: 'notes' },
    layoutManagerOpen: false,
    ratingOverlayOpen: false,
  });
  useWatchlistStore.setState({ isOpen: false });
});

function fireKey(
  key: string,
  opts: { shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean } = {},
  eventType: 'keydown' | 'keyup' = 'keydown'
) {
  const event = new KeyboardEvent(eventType, {
    key,
    shiftKey: opts.shiftKey ?? false,
    ctrlKey: opts.ctrlKey ?? false,
    altKey: opts.altKey ?? false,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(event);
}

describe('useKeyboardShortcuts', () => {
  it('Shift+Space toggles managing pane', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useLayoutStore.getState().managingPane.isOpen).toBe(false);
    fireKey(' ', { shiftKey: true });
    expect(useLayoutStore.getState().managingPane.isOpen).toBe(true);
    fireKey(' ', { shiftKey: true });
    expect(useLayoutStore.getState().managingPane.isOpen).toBe(false);
  });

  it('Ctrl+W toggles watchlist', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useWatchlistStore.getState().isOpen).toBe(false);
    fireKey('w', { ctrlKey: true });
    expect(useWatchlistStore.getState().isOpen).toBe(true);
  });

  it('Escape toggles layout manager', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useLayoutStore.getState().layoutManagerOpen).toBe(false);
    fireKey('Escape');
    expect(useLayoutStore.getState().layoutManagerOpen).toBe(true);
    fireKey('Escape');
    expect(useLayoutStore.getState().layoutManagerOpen).toBe(false);
  });

  it('Alt key opens managing pane on feedback tab', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useLayoutStore.getState().managingPane.isOpen).toBe(false);
    fireKey('Alt', {}, 'keyup');
    const state = useLayoutStore.getState();
    expect(state.managingPane.isOpen).toBe(true);
    expect(state.managingPane.activeTab).toBe('feedback');
  });

  it('Alt key closes managing pane when already on feedback', () => {
    useLayoutStore.setState({
      managingPane: { isOpen: true, activeTab: 'feedback' },
    });
    renderHook(() => useKeyboardShortcuts());
    fireKey('Alt', {}, 'keyup');
    expect(useLayoutStore.getState().managingPane.isOpen).toBe(false);
  });

  it('Shift+right-click toggles rating overlay', () => {
    renderHook(() => useKeyboardShortcuts());
    expect(useLayoutStore.getState().ratingOverlayOpen).toBe(false);
    const event = new MouseEvent('contextmenu', {
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(useLayoutStore.getState().ratingOverlayOpen).toBe(true);
  });

  it('regular right-click does not toggle rating overlay', () => {
    renderHook(() => useKeyboardShortcuts());
    const event = new MouseEvent('contextmenu', {
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(useLayoutStore.getState().ratingOverlayOpen).toBe(false);
  });

  it('returns shortcuts array', () => {
    const { result } = renderHook(() => useKeyboardShortcuts());
    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current[0]).toHaveProperty('key');
    expect(result.current[0]).toHaveProperty('description');
    expect(result.current[0]).toHaveProperty('action');
  });
});
