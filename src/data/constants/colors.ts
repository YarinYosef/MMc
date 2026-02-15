// 10 predefined hex colors for watchlist groups (all start with #F, maximally distinct)
export const WATCHLIST_COLORS = [
  '#FF0000', // red
  '#F0A500', // amber
  '#F5E100', // yellow
  '#F0FF00', // lime
  '#F07000', // orange
  '#F030A0', // magenta
  '#F050FF', // violet
  '#F00070', // crimson
  '#FA8072', // salmon
  '#F4A460', // sandy brown
] as const;

// Feed column colors for the 4 news feeds
export const NEWS_FEED_COLORS = {
  global: '#AB9FF2',    // phantom purple
  trend: '#F59E0B',     // amber
  'looking-at': '#10B981', // green
  watchlist: '#EC4899',  // pink
} as const;

// Signal colors for compass readings
export const SIGNAL_COLORS: Record<string, string> = {
  'strong-bullish': '#22C55E',
  'bullish': '#86EFAC',
  'neutral': '#9CA3AF',
  'bearish': '#FCA5A5',
  'strong-bearish': '#EF4444',
};

// Chart theme colors – Phantom Trade design tokens
export const CHART_COLORS = {
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#6B7280',
  accent: '#AB9FF2',
  background: '#131313',
  surface: 'rgba(255,255,255,0.06)',
  surfaceHover: 'rgba(255,255,255,0.1)',
  border: '#000000',
  text: '#FFFFFF',
  textMuted: '#999999',
  grid: 'rgba(255,255,255,0.03)',
} as const;
