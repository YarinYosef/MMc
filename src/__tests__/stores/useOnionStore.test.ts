import { useOnionStore } from '@/stores/useOnionStore';

beforeEach(() => {
  useOnionStore.setState({
    selectedRing: null,
    selectedSegment: null,
    hoveredSegment: null,
    timeframe: '1D',
    drillPath: [],
    rotation: 0,
    activeMoneyMap: 'cross-asset',
  });
});

describe('useOnionStore', () => {
  it('starts with default state', () => {
    const state = useOnionStore.getState();
    expect(state.selectedRing).toBeNull();
    expect(state.selectedSegment).toBeNull();
    expect(state.timeframe).toBe('1D');
    expect(state.drillPath).toEqual([]);
    expect(state.activeMoneyMap).toBe('cross-asset');
  });

  it('selects a ring', () => {
    useOnionStore.getState().selectRing('sector');
    expect(useOnionStore.getState().selectedRing).toBe('sector');
  });

  it('selects a segment', () => {
    useOnionStore.getState().selectSegment('tech-segment');
    expect(useOnionStore.getState().selectedSegment).toBe('tech-segment');
  });

  it('sets hovered segment', () => {
    useOnionStore.getState().setHoveredSegment('seg-1');
    expect(useOnionStore.getState().hoveredSegment).toBe('seg-1');
  });

  it('changes timeframe', () => {
    useOnionStore.getState().setTimeframe('1W');
    expect(useOnionStore.getState().timeframe).toBe('1W');
  });

  it('drills down', () => {
    useOnionStore.getState().drillDown('level-1');
    expect(useOnionStore.getState().drillPath).toEqual(['level-1']);
    expect(useOnionStore.getState().selectedSegment).toBe('level-1');

    useOnionStore.getState().drillDown('level-2');
    expect(useOnionStore.getState().drillPath).toEqual(['level-1', 'level-2']);
    expect(useOnionStore.getState().selectedSegment).toBe('level-2');
  });

  it('drills up', () => {
    useOnionStore.getState().drillDown('level-1');
    useOnionStore.getState().drillDown('level-2');
    useOnionStore.getState().drillUp();
    expect(useOnionStore.getState().drillPath).toEqual(['level-1']);
    expect(useOnionStore.getState().selectedSegment).toBe('level-1');
  });

  it('drills up to root sets selectedSegment to null', () => {
    useOnionStore.getState().drillDown('level-1');
    useOnionStore.getState().drillUp();
    expect(useOnionStore.getState().drillPath).toEqual([]);
    expect(useOnionStore.getState().selectedSegment).toBeNull();
  });

  it('resets drill', () => {
    useOnionStore.getState().drillDown('level-1');
    useOnionStore.getState().drillDown('level-2');
    useOnionStore.getState().selectRing('sector');
    useOnionStore.getState().resetDrill();
    expect(useOnionStore.getState().drillPath).toEqual([]);
    expect(useOnionStore.getState().selectedSegment).toBeNull();
    expect(useOnionStore.getState().selectedRing).toBeNull();
  });

  it('sets active money map type', () => {
    useOnionStore.getState().setActiveMoneyMap('sector');
    expect(useOnionStore.getState().activeMoneyMap).toBe('sector');
  });
});
