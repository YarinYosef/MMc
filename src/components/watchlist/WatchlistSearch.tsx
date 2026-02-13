'use client';

import { useState, useMemo } from 'react';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';
import { SECTORS } from '@/data/constants/tickers';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { type WatchlistItemType } from '@/data/types/watchlist';
import { cn } from '@/lib/utils';

const ITEM_TYPE_OPTIONS: { value: WatchlistItemType; label: string }[] = [
  { value: 'ticker', label: 'Ticker' },
  { value: 'sector', label: 'Sector' },
  { value: 'sub-sector', label: 'Sub-Sector' },
  { value: 'etf', label: 'ETF' },
  { value: 'currency', label: 'Currency' },
  { value: 'resource', label: 'Resource' },
];

export function WatchlistSearch() {
  const { searchQuery, setSearchQuery, activeGroupId, addItem } = useWatchlistStore();
  const [selectedType, setSelectedType] = useState<WatchlistItemType>('ticker');
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toUpperCase();

    if (selectedType === 'sector') {
      return SECTORS.filter((s) => s.toUpperCase().includes(q)).map((s) => ({
        symbol: s,
        name: s,
      }));
    }

    if (selectedType === 'sub-sector') {
      const subSectors = [...new Set(TICKER_UNIVERSE.map((t) => t.subSector))];
      return subSectors
        .filter((s) => s.toUpperCase().includes(q))
        .map((s) => ({ symbol: s, name: s }));
    }

    return TICKER_UNIVERSE.filter(
      (t) =>
        t.symbol.includes(q) ||
        t.name.toUpperCase().includes(q) ||
        t.sector.toUpperCase().includes(q)
    )
      .slice(0, 15)
      .map((t) => ({ symbol: t.symbol, name: `${t.name} (${t.sector})` }));
  }, [searchQuery, selectedType]);

  const handleAdd = (symbol: string) => {
    if (activeGroupId) {
      addItem(activeGroupId, symbol, selectedType);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      {/* Type selector */}
      <div className="flex items-center gap-0.5 px-2 pb-1">
        {ITEM_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedType(opt.value)}
            className={cn(
              'px-1.5 py-0.5 text-[9px] rounded transition-colors',
              selectedType === opt.value
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-600 hover:text-slate-400'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="px-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder={`Search ${selectedType}s...`}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 left-2 right-2 mt-1 max-h-48 overflow-y-auto bg-slate-800 border border-slate-600 rounded shadow-lg">
          {results.map((r) => (
            <button
              key={r.symbol}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAdd(r.symbol)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs hover:bg-slate-700 transition-colors text-left"
            >
              <span className="font-medium text-slate-200">{r.symbol}</span>
              <span className="text-slate-500 text-[10px] truncate ml-2">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
