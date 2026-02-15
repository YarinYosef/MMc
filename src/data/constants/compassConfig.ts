import { type CompassConfig, type CompassId } from '@/data/types/compass';

export const COMPASS_CONFIGS: CompassConfig[] = [
  // Decision Maker Layer
  {
    id: 'market-regime',
    name: 'Market Regime',
    shortName: 'Regime',
    layer: 'decision-maker',
    description: 'Overall market regime classification (risk-on, risk-off, transition)',
    weight: 1.0,
  },
  {
    id: 'dollar-liquidity',
    name: 'Dollar Liquidity',
    shortName: '$Liq',
    layer: 'decision-maker',
    description: 'Global dollar liquidity conditions and Fed balance sheet',
    weight: 0.9,
  },
  {
    id: 'microsoft-proxy',
    name: 'Microsoft Proxy',
    shortName: 'MSFT',
    layer: 'decision-maker',
    description: 'Microsoft as institutional risk appetite proxy',
    weight: 0.8,
  },
  {
    id: 'vix',
    name: 'VIX Compass',
    shortName: 'VIX',
    layer: 'decision-maker',
    description: 'VIX term structure and volatility regime',
    weight: 0.9,
  },
  {
    id: 'volume',
    name: 'Volume Compass',
    shortName: 'Vol',
    layer: 'decision-maker',
    description: 'Market-wide volume analysis and distribution days',
    weight: 0.7,
  },

  // Safety Net Layer
  {
    id: 'social-sentiment',
    name: 'Social Sentiment',
    shortName: 'Social',
    layer: 'safety-net',
    description: 'Aggregated social media sentiment analysis',
    weight: 0.5,
  },
  {
    id: 'fear-greed',
    name: 'Fear & Greed',
    shortName: 'F&G',
    layer: 'safety-net',
    description: 'CNN Fear & Greed index analogue',
    weight: 0.6,
  },
  {
    id: 'structure-sr',
    name: 'Structure S/R',
    shortName: 'S/R',
    layer: 'safety-net',
    description: 'Key support/resistance levels proximity',
    weight: 0.7,
  },
  {
    id: 'gamma',
    name: 'Gamma Exposure',
    shortName: 'GEX',
    layer: 'safety-net',
    description: 'Options dealer gamma positioning',
    weight: 0.6,
  },
  {
    id: 'short-interest',
    name: 'Short Interest',
    shortName: 'SI',
    layer: 'safety-net',
    description: 'Short interest changes and squeeze potential',
    weight: 0.5,
  },
  {
    id: 'breadth-participation',
    name: 'Breadth & Participation',
    shortName: 'Breadth',
    layer: 'safety-net',
    description: 'Advance/decline ratio and participation breadth',
    weight: 0.7,
  },
  {
    id: 'trend-quality',
    name: 'Trend Quality',
    shortName: 'Trend',
    layer: 'safety-net',
    description: 'Trend strength and moving average analysis',
    weight: 0.6,
  },
  {
    id: 'etf-passive-flow',
    name: 'ETF Passive Flow',
    shortName: 'ETF',
    layer: 'safety-net',
    description: 'ETF inflow/outflow tracking',
    weight: 0.5,
  },
  {
    id: 'futures-positioning',
    name: 'Futures Positioning',
    shortName: 'Futures',
    layer: 'safety-net',
    description: 'COT report and futures positioning data',
    weight: 0.5,
  },
  {
    id: 'sector-overheat',
    name: 'Sector Overheat',
    shortName: 'Heat',
    layer: 'safety-net',
    description: 'Sector-level RSI and overbought/oversold signals',
    weight: 0.5,
  },

  // Support Layer
  {
    id: 'analysts',
    name: 'Analysts Compass',
    shortName: 'Analysts',
    layer: 'support',
    description: 'Consensus analyst ratings and price target changes',
    weight: 0.4,
  },
  {
    id: 'time',
    name: 'Time Compass',
    shortName: 'Time',
    layer: 'support',
    description: 'Seasonal patterns, expiration cycles, earnings calendar',
    weight: 0.4,
  },
  {
    id: 'technical-anomalies',
    name: 'Technical Anomalies',
    shortName: 'Anomaly',
    layer: 'support',
    description: 'Unusual technical patterns and divergences',
    weight: 0.3,
  },
];

export const COMPASS_BY_ID: Record<CompassId, CompassConfig> = Object.fromEntries(
  COMPASS_CONFIGS.map((c) => [c.id, c])
) as Record<CompassId, CompassConfig>;

export const DEFAULT_COMPASS_ORDER: CompassId[] = COMPASS_CONFIGS.map((c) => c.id);
