import { generateCompassState, generateAllCompassStates } from '@/data/generators/compassDataGenerator';
import type { CompassSignal } from '@/data/types/compass';
import { COMPASS_CONFIGS } from '@/data/constants/compassConfig';

describe('generateCompassState', () => {
  it('generates a valid compass state for a given id', () => {
    const state = generateCompassState('market-regime');
    expect(state.id).toBe('market-regime');
    expect(state.value).toBeGreaterThanOrEqual(-100);
    expect(state.value).toBeLessThanOrEqual(100);
    expect(state.confidence).toBeGreaterThanOrEqual(0);
    expect(state.confidence).toBeLessThanOrEqual(100);
    expect(typeof state.lastUpdated).toBe('number');
    expect(state.details).toBeDefined();
  });

  it('generates correct signal based on value', () => {
    const validSignals: CompassSignal[] = [
      'strong-bullish', 'bullish', 'neutral', 'bearish', 'strong-bearish'
    ];
    for (let i = 0; i < 50; i++) {
      const state = generateCompassState('vix');
      expect(validSignals).toContain(state.signal);
    }
  });

  it('uses previous state for mean reversion', () => {
    const prev = generateCompassState('fear-greed');
    const next = generateCompassState('fear-greed', prev);
    expect(next.id).toBe('fear-greed');
    // Values should be relatively close due to mean reversion
    expect(Math.abs(next.value - prev.value)).toBeLessThan(50);
  });

  it('generates details for market-regime compass', () => {
    const state = generateCompassState('market-regime');
    expect(state.details).toHaveProperty('regime');
    expect(state.details).toHaveProperty('trendStrength');
    expect(state.details).toHaveProperty('daysInRegime');
  });

  it('generates details for vix compass', () => {
    const state = generateCompassState('vix');
    expect(state.details).toHaveProperty('spotVix');
    expect(state.details).toHaveProperty('termStructure');
  });

  it('generates details for fear-greed compass', () => {
    const state = generateCompassState('fear-greed');
    expect(state.details).toHaveProperty('index');
    expect(state.details).toHaveProperty('previous');
  });

  it('generates details for dollar-liquidity compass', () => {
    const state = generateCompassState('dollar-liquidity');
    expect(state.details).toHaveProperty('fedBalance');
    expect(state.details).toHaveProperty('rrpFacility');
  });
});

describe('generateAllCompassStates', () => {
  it('generates states for all configured compasses', () => {
    const states = generateAllCompassStates();
    expect(states.size).toBe(COMPASS_CONFIGS.length);
    for (const config of COMPASS_CONFIGS) {
      expect(states.has(config.id)).toBe(true);
    }
  });

  it('accepts previous states for updates', () => {
    const initial = generateAllCompassStates();
    const updated = generateAllCompassStates(initial);
    expect(updated.size).toBe(initial.size);
    for (const [id] of initial) {
      expect(updated.has(id)).toBe(true);
    }
  });
});
