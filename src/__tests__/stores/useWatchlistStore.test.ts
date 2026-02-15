import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { WATCHLIST_COLORS } from '@/data/constants/colors';

// Reset store between tests
beforeEach(() => {
  useWatchlistStore.setState({
    groups: [
      {
        id: 'default',
        name: 'Main Watchlist',
        color: WATCHLIST_COLORS[0],
        items: [
          { symbol: 'MSFT', type: 'ticker' as const, addedAt: Date.now(), subscribedToNews: false },
          { symbol: 'AAPL', type: 'ticker' as const, addedAt: Date.now(), subscribedToNews: false },
        ],
        createdAt: Date.now(),
        sortOrder: 0,
      },
    ],
    isOpen: false,
    activeGroupId: 'default',
    filterGroupId: null,
    searchQuery: '',
    isDetached: false,
    notificationPrefs: [],
    contactInfo: { emailAddress: '', phoneNumber: '' },
  });
});

describe('useWatchlistStore', () => {
  describe('group management', () => {
    it('creates a new watchlist group', () => {
      const store = useWatchlistStore.getState();
      const id = store.createGroup('New Group');
      const state = useWatchlistStore.getState();
      expect(state.groups).toHaveLength(2);
      expect(state.groups[1].name).toBe('New Group');
      expect(state.activeGroupId).toBe(id);
    });

    it('assigns a unique color to new group', () => {
      const store = useWatchlistStore.getState();
      store.createGroup('Group 2');
      const state = useWatchlistStore.getState();
      const colors = state.groups.map((g) => g.color);
      // Should have 2 different colors
      expect(new Set(colors).size).toBe(2);
    });

    it('deletes a group', () => {
      const store = useWatchlistStore.getState();
      const id = store.createGroup('To Delete');
      expect(id).not.toBeNull();
      useWatchlistStore.getState().deleteGroup(id!);
      const state = useWatchlistStore.getState();
      expect(state.groups.find((g) => g.id === id)).toBeUndefined();
    });

    it('renames a group', () => {
      useWatchlistStore.getState().renameGroup('default', 'Renamed');
      expect(useWatchlistStore.getState().groups[0].name).toBe('Renamed');
    });

    it('changes group color', () => {
      useWatchlistStore.getState().setGroupColor('default', '#FF0000');
      expect(useWatchlistStore.getState().groups[0].color).toBe('#FF0000');
    });
  });

  describe('item management', () => {
    it('adds an item to a group', () => {
      useWatchlistStore.getState().addItem('default', 'NVDA');
      const group = useWatchlistStore.getState().groups.find((g) => g.id === 'default');
      expect(group!.items).toHaveLength(3);
      expect(group!.items.find((i) => i.symbol === 'NVDA')).toBeDefined();
    });

    it('does not add duplicate items', () => {
      useWatchlistStore.getState().addItem('default', 'MSFT');
      const group = useWatchlistStore.getState().groups.find((g) => g.id === 'default');
      expect(group!.items.filter((i) => i.symbol === 'MSFT')).toHaveLength(1);
    });

    it('removes an item from a group', () => {
      useWatchlistStore.getState().removeItem('default', 'MSFT');
      const group = useWatchlistStore.getState().groups.find((g) => g.id === 'default');
      expect(group!.items.find((i) => i.symbol === 'MSFT')).toBeUndefined();
    });

    it('updates item notes', () => {
      useWatchlistStore.getState().updateItemNotes('default', 'MSFT', 'test note');
      const group = useWatchlistStore.getState().groups.find((g) => g.id === 'default');
      const item = group!.items.find((i) => i.symbol === 'MSFT');
      expect(item!.notes).toBe('test note');
    });

    it('sets alert on an item', () => {
      useWatchlistStore.getState().setAlert('default', 'MSFT', 450, 'above');
      const group = useWatchlistStore.getState().groups.find((g) => g.id === 'default');
      const item = group!.items.find((i) => i.symbol === 'MSFT');
      expect(item!.alertPrice).toBe(450);
      expect(item!.alertDirection).toBe('above');
    });
  });

  describe('UI state', () => {
    it('toggles open', () => {
      expect(useWatchlistStore.getState().isOpen).toBe(false);
      useWatchlistStore.getState().toggleOpen();
      expect(useWatchlistStore.getState().isOpen).toBe(true);
      useWatchlistStore.getState().toggleOpen();
      expect(useWatchlistStore.getState().isOpen).toBe(false);
    });

    it('sets search query', () => {
      useWatchlistStore.getState().setSearchQuery('apple');
      expect(useWatchlistStore.getState().searchQuery).toBe('apple');
    });

    it('sets active group', () => {
      useWatchlistStore.getState().setActiveGroup('test-id');
      expect(useWatchlistStore.getState().activeGroupId).toBe('test-id');
    });

    it('sets detached state', () => {
      useWatchlistStore.getState().setDetached(true);
      expect(useWatchlistStore.getState().isDetached).toBe(true);
    });
  });
});
