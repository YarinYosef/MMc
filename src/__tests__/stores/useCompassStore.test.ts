import { useCompassStore } from '@/stores/useCompassStore';
import { DEFAULT_COMPASS_ORDER, COMPASS_CONFIGS } from '@/data/constants/compassConfig';
import type { CompassId } from '@/data/types/compass';

beforeEach(() => {
  const state = useCompassStore.getState();
  if (state.intervalId) state.stopUpdates();
  useCompassStore.setState({
    compassStates: new Map(),
    barState: {
      order: [...DEFAULT_COMPASS_ORDER],
      expanded: null,
      hovered: null,
      hidden: new Set(),
      layerFilter: 'all',
    },
    intervalId: null,
  });
});

afterEach(() => {
  const state = useCompassStore.getState();
  if (state.intervalId) state.stopUpdates();
});

describe('useCompassStore', () => {
  it('starts with empty compass states', () => {
    const state = useCompassStore.getState();
    expect(state.compassStates.size).toBe(0);
  });

  it('startUpdates initializes compass states', () => {
    useCompassStore.getState().startUpdates();
    const state = useCompassStore.getState();
    expect(state.compassStates.size).toBe(COMPASS_CONFIGS.length);
    expect(state.intervalId).not.toBeNull();
  });

  it('stopUpdates clears interval', () => {
    useCompassStore.getState().startUpdates();
    useCompassStore.getState().stopUpdates();
    expect(useCompassStore.getState().intervalId).toBeNull();
  });

  it('startUpdates is idempotent', () => {
    useCompassStore.getState().startUpdates();
    const firstId = useCompassStore.getState().intervalId;
    useCompassStore.getState().startUpdates();
    expect(useCompassStore.getState().intervalId).toBe(firstId);
  });

  it('sets expanded compass', () => {
    useCompassStore.getState().setExpanded('vix');
    expect(useCompassStore.getState().barState.expanded).toBe('vix');
  });

  it('clears expanded compass', () => {
    useCompassStore.getState().setExpanded('vix');
    useCompassStore.getState().setExpanded(null);
    expect(useCompassStore.getState().barState.expanded).toBeNull();
  });

  it('sets layer filter', () => {
    useCompassStore.getState().setLayerFilter('decision-maker');
    expect(useCompassStore.getState().barState.layerFilter).toBe('decision-maker');
  });

  it('reorders compasses', () => {
    const newOrder: CompassId[] = [...DEFAULT_COMPASS_ORDER].reverse();
    useCompassStore.getState().reorderCompasses(newOrder);
    expect(useCompassStore.getState().barState.order).toEqual(newOrder);
  });

  it('getCompassState returns undefined when not initialized', () => {
    const state = useCompassStore.getState().getCompassState('vix');
    expect(state).toBeUndefined();
  });

  it('getCompassState returns value after startUpdates', () => {
    useCompassStore.getState().startUpdates();
    const state = useCompassStore.getState().getCompassState('vix');
    expect(state).toBeDefined();
    expect(state!.id).toBe('vix');
  });
});
