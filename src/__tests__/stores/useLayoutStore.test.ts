import { useLayoutStore } from '@/stores/useLayoutStore';

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
        ],
        newsHeightPercent: 8,
        detachedWindows: [],
      },
    ],
    windows: [],
    isDragging: false,
    dragSource: null,
    dragTarget: null,
    managingPane: {
      isOpen: false,
      activeTab: 'notes',
    },
  });
});

describe('useLayoutStore', () => {
  describe('layout management', () => {
    it('saves a new layout', () => {
      useLayoutStore.getState().saveCurrentLayout('My Layout');
      const state = useLayoutStore.getState();
      expect(state.savedLayouts).toHaveLength(2);
      expect(state.savedLayouts[1].name).toBe('My Layout');
      expect(state.currentLayoutId).toBe(state.savedLayouts[1].id);
    });

    it('loads a layout', () => {
      useLayoutStore.getState().saveCurrentLayout('Layout 2');
      const layoutId = useLayoutStore.getState().savedLayouts[1].id;
      useLayoutStore.getState().loadLayout('default');
      expect(useLayoutStore.getState().currentLayoutId).toBe('default');
      useLayoutStore.getState().loadLayout(layoutId);
      expect(useLayoutStore.getState().currentLayoutId).toBe(layoutId);
    });

    it('does not load non-existent layout', () => {
      useLayoutStore.getState().loadLayout('nonexistent');
      expect(useLayoutStore.getState().currentLayoutId).toBe('default');
    });

    it('deletes a layout', () => {
      useLayoutStore.getState().saveCurrentLayout('To Delete');
      const layoutId = useLayoutStore.getState().savedLayouts[1].id;
      useLayoutStore.getState().deleteLayout(layoutId);
      expect(useLayoutStore.getState().savedLayouts).toHaveLength(1);
      expect(useLayoutStore.getState().currentLayoutId).toBe('default');
    });

    it('does not delete default layout', () => {
      useLayoutStore.getState().deleteLayout('default');
      expect(useLayoutStore.getState().savedLayouts).toHaveLength(1);
    });
  });

  describe('window management', () => {
    it('opens a window', () => {
      useLayoutStore.getState().openWindow({
        id: 'test-window',
        type: 'detached-news',
        isOpen: true,
      });
      expect(useLayoutStore.getState().windows).toHaveLength(1);
    });

    it('replaces window with same id', () => {
      useLayoutStore.getState().openWindow({
        id: 'test-window',
        type: 'detached-news',
        isOpen: true,
      });
      useLayoutStore.getState().openWindow({
        id: 'test-window',
        type: 'detached-watchlist',
        isOpen: true,
      });
      expect(useLayoutStore.getState().windows).toHaveLength(1);
      expect(useLayoutStore.getState().windows[0].type).toBe('detached-watchlist');
    });

    it('closes a window', () => {
      useLayoutStore.getState().openWindow({
        id: 'test-window',
        type: 'detached-news',
        isOpen: true,
      });
      useLayoutStore.getState().closeWindow('test-window');
      expect(useLayoutStore.getState().windows).toHaveLength(0);
    });

    it('updates window position', () => {
      useLayoutStore.getState().openWindow({
        id: 'test-window',
        type: 'detached-news',
        isOpen: true,
        position: { x: 0, y: 0 },
      });
      useLayoutStore.getState().updateWindowPosition('test-window', { x: 100, y: 200 });
      expect(useLayoutStore.getState().windows[0].position).toEqual({ x: 100, y: 200 });
    });

    it('updates window size', () => {
      useLayoutStore.getState().openWindow({
        id: 'test-window',
        type: 'detached-news',
        isOpen: true,
        size: { width: 400, height: 300 },
      });
      useLayoutStore.getState().updateWindowSize('test-window', { width: 800, height: 600 });
      expect(useLayoutStore.getState().windows[0].size).toEqual({ width: 800, height: 600 });
    });
  });

  describe('drag state', () => {
    it('starts drag', () => {
      useLayoutStore.getState().startDrag('source-1');
      const state = useLayoutStore.getState();
      expect(state.isDragging).toBe(true);
      expect(state.dragSource).toBe('source-1');
    });

    it('sets drag target', () => {
      useLayoutStore.getState().setDragTarget('target-1');
      expect(useLayoutStore.getState().dragTarget).toBe('target-1');
    });

    it('ends drag', () => {
      useLayoutStore.getState().startDrag('source-1');
      useLayoutStore.getState().setDragTarget('target-1');
      useLayoutStore.getState().endDrag();
      const state = useLayoutStore.getState();
      expect(state.isDragging).toBe(false);
      expect(state.dragSource).toBeNull();
      expect(state.dragTarget).toBeNull();
    });
  });

  describe('managing pane', () => {
    it('toggles managing pane', () => {
      expect(useLayoutStore.getState().managingPane.isOpen).toBe(false);
      useLayoutStore.getState().toggleManagingPane();
      expect(useLayoutStore.getState().managingPane.isOpen).toBe(true);
      useLayoutStore.getState().toggleManagingPane();
      expect(useLayoutStore.getState().managingPane.isOpen).toBe(false);
    });

    it('sets managing tab', () => {
      useLayoutStore.getState().setManagingTab('alerts');
      expect(useLayoutStore.getState().managingPane.activeTab).toBe('alerts');
    });
  });

  describe('layout limits', () => {
    it('enforces max 4 custom layouts', () => {
      useLayoutStore.getState().saveCurrentLayout('Layout 1');
      useLayoutStore.getState().saveCurrentLayout('Layout 2');
      useLayoutStore.getState().saveCurrentLayout('Layout 3');
      useLayoutStore.getState().saveCurrentLayout('Layout 4');
      // Should have 5 (1 default + 4 custom)
      expect(useLayoutStore.getState().savedLayouts).toHaveLength(5);
      // 5th custom should be rejected
      useLayoutStore.getState().saveCurrentLayout('Layout 5');
      expect(useLayoutStore.getState().savedLayouts).toHaveLength(5);
    });
  });

  describe('layout manager and rating overlay', () => {
    it('toggles layout manager panel', () => {
      expect(useLayoutStore.getState().layoutManagerOpen).toBe(false);
      useLayoutStore.getState().toggleLayoutManager();
      expect(useLayoutStore.getState().layoutManagerOpen).toBe(true);
      useLayoutStore.getState().toggleLayoutManager();
      expect(useLayoutStore.getState().layoutManagerOpen).toBe(false);
    });

    it('toggles rating overlay', () => {
      expect(useLayoutStore.getState().ratingOverlayOpen).toBe(false);
      useLayoutStore.getState().toggleRatingOverlay();
      expect(useLayoutStore.getState().ratingOverlayOpen).toBe(true);
      useLayoutStore.getState().toggleRatingOverlay();
      expect(useLayoutStore.getState().ratingOverlayOpen).toBe(false);
    });
  });
});
