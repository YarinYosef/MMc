export type CompassSignal = 'strong-bullish' | 'bullish' | 'neutral' | 'bearish' | 'strong-bearish';

export type CompassLayer = 'decision-maker' | 'safety-net' | 'support';

export type CompassId =
  // Decision Maker layer
  | 'market-regime'
  | 'dollar-liquidity'
  | 'microsoft-proxy'
  | 'vix'
  | 'volume'
  // Safety Net layer
  | 'social-sentiment'
  | 'fear-greed'
  | 'structure-sr'
  | 'gamma'
  | 'short-interest'
  | 'breadth-participation'
  | 'trend-quality'
  | 'etf-passive-flow'
  | 'futures-positioning'
  | 'sector-overheat'
  // Support layer
  | 'analysts'
  | 'time'
  | 'technical-anomalies';

export interface CompassConfig {
  id: CompassId;
  name: string;
  shortName: string;
  layer: CompassLayer;
  description: string;
  weight: number;
}

export interface CompassState {
  id: CompassId;
  signal: CompassSignal;
  value: number; // -100 to 100
  confidence: number; // 0 to 100
  lastUpdated: number;
  details: Record<string, number | string>;
}

export interface CompassBarState {
  order: CompassId[];
  expanded: CompassId | null;
  hovered: CompassId | null;
  hidden: Set<CompassId>;
  layerFilter: CompassLayer | 'all';
}
