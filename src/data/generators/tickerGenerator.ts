import { TICKER_UNIVERSE } from '@/data/constants/tickers';

export function getTickersBySection(sector: string): string[] {
  return TICKER_UNIVERSE.filter((t) => t.sector === sector).map((t) => t.symbol);
}

export function getTickersBySubSector(subSector: string): string[] {
  return TICKER_UNIVERSE.filter((t) => t.subSector === subSector).map((t) => t.symbol);
}

export function searchTickers(query: string): string[] {
  const q = query.toLowerCase();
  return TICKER_UNIVERSE.filter(
    (t) =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.sector.toLowerCase().includes(q)
  ).map((t) => t.symbol);
}

export function getTickerInfo(symbol: string) {
  return TICKER_UNIVERSE.find((t) => t.symbol === symbol);
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export function formatChange(change: number, percent: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(1)}B`;
  if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `${(volume / 1_000).toFixed(1)}K`;
  return volume.toString();
}

export function formatMarketCap(cap: number): string {
  if (cap >= 1_000_000_000_000) return `$${(cap / 1_000_000_000_000).toFixed(1)}T`;
  if (cap >= 1_000_000_000) return `$${(cap / 1_000_000_000).toFixed(1)}B`;
  if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(1)}M`;
  return `$${cap}`;
}
