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
  global: '#3B82F6',    // blue
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

// Chart theme colors
export const CHART_COLORS = {
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#6B7280',
  accent: '#3B82F6',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceHover: '#334155',
  border: '#334155',
  text: '#E2E8F0',
  textMuted: '#94A3B8',
  grid: '#1E293B',
} as const;
