'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { WidgetContainer } from '@/components/layout/WidgetContainer';
import { useScreenerStore } from '@/stores/useScreenerStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';
import { type ScreenerSortField, type ScreenerPreset } from '@/data/types/screener';

const SECTOR_ABBREV: Record<string, string> = {
  Technology: 'Tech',
  Healthcare: 'HC',
  Financials: 'Fin',
  Consumer: 'Con',
  Energy: 'Enrg',
  Industrials: 'Ind',
  'Real Estate': 'RE',
  Communication: 'Comm',
  Staples: 'Stpl',
};

const tickerDefMap = new Map(TICKER_UNIVERSE.map((t) => [t.symbol, t]));

const PRESETS: { key: ScreenerPreset; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'top-gainers', label: 'Gainers' },
  { key: 'top-losers', label: 'Losers' },
  { key: 'most-active', label: 'Active' },
  { key: 'high-dividend', label: 'Dividend' },
  { key: 'low-pe', label: 'Low P/E' },
];

const COLUMNS: { key: ScreenerSortField; label: string; align: 'left' | 'right' }[] = [
  { key: 'symbol', label: 'Ticker', align: 'left' },
  { key: 'price', label: 'Price', align: 'right' },
  { key: 'changePercent', label: 'Chg%', align: 'right' },
  { key: 'volume', label: 'Vol', align: 'right' },
  { key: 'marketCap', label: 'MCap', align: 'right' },
  { key: 'pe', label: 'P/E', align: 'right' },
];

function formatVolume(vol: number): string {
  if (vol >= 1e9) return (vol / 1e9).toFixed(1) + 'B';
  if (vol >= 1e6) return (vol / 1e6).toFixed(1) + 'M';
  if (vol >= 1e3) return (vol / 1e3).toFixed(0) + 'K';
  return vol.toString();
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return (cap / 1e12).toFixed(1) + 'T';
  if (cap >= 1e9) return (cap / 1e9).toFixed(0) + 'B';
  if (cap >= 1e6) return (cap / 1e6).toFixed(0) + 'M';
  return cap.toString();
}

export function StockScreener() {
  const filters = useScreenerStore((s) => s.filters);
  const sortField = useScreenerStore((s) => s.sortField);
  const sortDirection = useScreenerStore((s) => s.sortDirection);
  const activePreset = useScreenerStore((s) => s.activePreset);
  const setFilter = useScreenerStore((s) => s.setFilter);
  const setSortField = useScreenerStore((s) => s.setSortField);
  const applyPreset = useScreenerStore((s) => s.applyPreset);
  const getFilteredTickers = useScreenerStore((s) => s.getFilteredTickers);
  const setSelectedSymbol = useDetailsStore((s) => s.setSelectedSymbol);

  // Subscribe to market tickers to trigger re-render on updates
  const tickers = useMarketStore((s) => s.tickers);

  const [sectorOpen, setSectorOpen] = useState(false);

  const sectors = useMemo(() => {
    const s = new Set<string>();
    for (const t of TICKER_UNIVERSE) s.add(t.sector);
    return Array.from(s).sort();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredTickers = useMemo(() => getFilteredTickers(), [filters, sortField, sortDirection, tickers]);

  const handleRowClick = useCallback(
    (symbol: string) => {
      setSelectedSymbol(symbol);
    },
    [setSelectedSymbol]
  );

  return (
    <WidgetContainer id="stock-screener" className="h-full" noPadding>
      <div className="h-full flex flex-col font-mono">
        {/* Header: search + sector */}
        <div className="px-2 pt-2 pb-1 border-b border-black space-y-1.5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search ticker..."
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded px-2 py-1 text-[10px] text-white placeholder-[#555555] outline-none focus:border-[#AB9FF2]/50 transition-colors"
            />
            {filters.search && (
              <button
                onClick={() => setFilter('search', '')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#999999] text-[10px]"
              >
                x
              </button>
            )}
          </div>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className={cn(
                  'px-1.5 py-0.5 text-[9px] rounded transition-colors',
                  activePreset === p.key
                    ? 'bg-[#AB9FF2] text-white'
                    : 'text-[#777777] hover:text-[#999999] bg-white/[0.03] hover:bg-white/[0.06]'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sector dropdown */}
          <div className="relative">
            <button
              onClick={() => setSectorOpen(!sectorOpen)}
              className="w-full flex items-center justify-between px-2 py-0.5 text-[9px] bg-white/[0.04] border border-white/[0.06] rounded text-[#999999] hover:border-[#AB9FF2]/30 transition-colors"
            >
              <span>{filters.sector || 'All Sectors'}</span>
              <span className="text-[8px] ml-1">{sectorOpen ? '\u25B2' : '\u25BC'}</span>
            </button>
            {sectorOpen && (
              <div className="absolute top-full left-0 right-0 mt-0.5 bg-[#1a1a1a] border border-white/[0.08] rounded shadow-lg z-20 max-h-40 overflow-y-auto">
                <button
                  onClick={() => { setFilter('sector', ''); setSectorOpen(false); }}
                  className={cn(
                    'w-full text-left px-2 py-1 text-[9px] hover:bg-white/[0.06] transition-colors',
                    !filters.sector ? 'text-[#AB9FF2]' : 'text-[#999999]'
                  )}
                >
                  All Sectors
                </button>
                {sectors.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setFilter('sector', s); setSectorOpen(false); }}
                    className={cn(
                      'w-full text-left px-2 py-1 text-[9px] hover:bg-white/[0.06] transition-colors',
                      filters.sector === s ? 'text-[#AB9FF2]' : 'text-[#999999]'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="flex items-center px-2 py-1 border-b border-white/[0.04] bg-white/[0.02]">
          {COLUMNS.map((col, i) => (
            <React.Fragment key={col.key}>
              <button
                onClick={() => setSortField(col.key)}
                className={cn(
                  'text-[9px] uppercase tracking-wide transition-colors',
                  col.key === 'symbol' ? 'flex-[2] text-left' : 'flex-1 text-right',
                  sortField === col.key ? 'text-[#AB9FF2]' : 'text-[#666666] hover:text-[#999999]'
                )}
              >
                {col.label}
                {sortField === col.key && (
                  <span className="ml-0.5 text-[7px]">{sortDirection === 'asc' ? '\u25B2' : '\u25BC'}</span>
                )}
              </button>
              {i === 0 && (
                <span className="flex-[0.8] text-left text-[9px] uppercase tracking-wide text-[#666666]">
                  Sect
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Scrollable ticker list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {filteredTickers.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-[10px] text-[#555555]">
              No matches
            </div>
          ) : (
            filteredTickers.map((ticker) => {
              const isPositive = ticker.changePercent >= 0;
              return (
                <button
                  key={ticker.symbol}
                  onClick={() => handleRowClick(ticker.symbol)}
                  className="w-full flex items-center px-2 py-[5px] hover:bg-white/[0.04] transition-colors border-b border-white/[0.02] group"
                >
                  {/* Symbol */}
                  <span className="flex-[2] text-left text-[10px] text-white font-medium group-hover:text-[#AB9FF2] transition-colors truncate">
                    {ticker.symbol}
                  </span>
                  {/* Sector */}
                  <span className="flex-[0.8] text-left text-[9px] text-[#666666]">
                    {SECTOR_ABBREV[tickerDefMap.get(ticker.symbol)?.sector ?? ''] ?? ''}
                  </span>
                  {/* Price */}
                  <span className="flex-1 text-right text-[10px] text-[#cccccc]">
                    {ticker.price.toFixed(2)}
                  </span>
                  {/* Change% */}
                  <span
                    className={cn(
                      'flex-1 text-right text-[10px] font-medium',
                      isPositive ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {isPositive ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                  </span>
                  {/* Volume */}
                  <span className="flex-1 text-right text-[10px] text-[#888888]">
                    {formatVolume(ticker.volume)}
                  </span>
                  {/* Market Cap */}
                  <span className="flex-1 text-right text-[10px] text-[#888888]">
                    {formatMarketCap(ticker.marketCap)}
                  </span>
                  {/* P/E */}
                  <span className="flex-1 text-right text-[10px] text-[#888888]">
                    {ticker.pe.toFixed(1)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}
