import { type CompassState, type CompassSignal, type CompassId } from '@/data/types/compass';

/** Create a CompassState with sensible defaults, easily overridable */
export function makeState(
  id: CompassId,
  overrides: Partial<Omit<CompassState, 'id'>> & { details?: Record<string, number | string> } = {},
): CompassState {
  return {
    id,
    signal: 'neutral' as CompassSignal,
    value: 0,
    confidence: 75,
    lastUpdated: Date.now(),
    details: {},
    ...overrides,
  };
}
