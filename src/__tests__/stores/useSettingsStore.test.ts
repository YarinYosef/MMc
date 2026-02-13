import { useSettingsStore } from '@/stores/useSettingsStore';

beforeEach(() => {
  useSettingsStore.setState({
    theme: 'dark',
    updateSpeed: 'normal',
    showTooltips: true,
    animationsEnabled: true,
    newsAutoScroll: true,
    defaultTimeframe: '1D',
    compassLayerFilter: 'all',
    soundEnabled: false,
  });
});

describe('useSettingsStore', () => {
  it('starts with default settings', () => {
    const state = useSettingsStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.updateSpeed).toBe('normal');
    expect(state.showTooltips).toBe(true);
    expect(state.animationsEnabled).toBe(true);
    expect(state.soundEnabled).toBe(false);
  });

  it('sets update speed', () => {
    useSettingsStore.getState().setUpdateSpeed('fast');
    expect(useSettingsStore.getState().updateSpeed).toBe('fast');
  });

  it('toggles tooltips', () => {
    useSettingsStore.getState().toggleTooltips();
    expect(useSettingsStore.getState().showTooltips).toBe(false);
    useSettingsStore.getState().toggleTooltips();
    expect(useSettingsStore.getState().showTooltips).toBe(true);
  });

  it('toggles animations', () => {
    useSettingsStore.getState().toggleAnimations();
    expect(useSettingsStore.getState().animationsEnabled).toBe(false);
  });

  it('toggles news auto scroll', () => {
    useSettingsStore.getState().toggleNewsAutoScroll();
    expect(useSettingsStore.getState().newsAutoScroll).toBe(false);
  });

  it('sets default timeframe', () => {
    useSettingsStore.getState().setDefaultTimeframe('1W');
    expect(useSettingsStore.getState().defaultTimeframe).toBe('1W');
  });

  it('toggles sound', () => {
    useSettingsStore.getState().toggleSound();
    expect(useSettingsStore.getState().soundEnabled).toBe(true);
  });
});
