'use client';

import { useState } from 'react';
import { type WatchlistItem as WatchlistItemType } from '@/data/types/watchlist';
import { type Ticker } from '@/data/types/market';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useOnionStore } from '@/stores/useOnionStore';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';

interface WatchlistItemProps {
  item: WatchlistItemType;
  groupId: string;
  groupColor: string;
  ticker: Ticker | undefined;
  isDragging?: boolean;
}

export function WatchlistItemRow({ item, groupId, groupColor, ticker, isDragging }: WatchlistItemProps) {
  const toggleNewsSubscription = useWatchlistStore((s) => s.toggleNewsSubscription);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const updateItemNotes = useWatchlistStore((s) => s.updateItemNotes);
  const setSelectedSymbol = useDetailsStore((s) => s.setSelectedSymbol);
  const selectSegment = useOnionStore((s) => s.selectSegment);

  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(item.notes ?? '');

  const handleClick = () => {
    setSelectedSymbol(item.symbol);
    selectSegment(item.symbol);
  };

  const handleSaveNotes = () => {
    updateItemNotes(groupId, item.symbol, noteText);
    setShowNotes(false);
  };

  const changeColor = ticker && ticker.change >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className={cn(isDragging && 'opacity-50')}>
      <div
        className="group flex items-center gap-1 px-2 py-1 hover:bg-slate-800/60 transition-colors cursor-pointer text-xs"
      >
        {/* Color indicator */}
        <span
          className="w-1 h-6 rounded-full shrink-0"
          style={{ backgroundColor: groupColor }}
        />

        {/* Symbol + click to select */}
        <button
          onClick={handleClick}
          className="font-medium text-slate-200 w-12 text-left shrink-0 hover:text-white transition-colors"
        >
          {item.symbol}
        </button>

        {ticker ? (
          <>
            {/* Last price */}
            <span className="text-slate-300 font-mono w-16 text-right shrink-0">
              ${formatNumber(ticker.price)}
            </span>

            {/* Change % */}
            <span className={cn('font-mono w-14 text-right shrink-0', changeColor)}>
              {ticker.changePercent >= 0 ? '+' : ''}{formatNumber(ticker.changePercent)}%
            </span>

            {/* Prev Close */}
            <span className="text-slate-500 font-mono w-14 text-right shrink-0 hidden lg:block" title="Prev Close">
              {formatNumber(ticker.previousClose)}
            </span>

            {/* High */}
            <span className="text-slate-500 font-mono w-14 text-right shrink-0 hidden xl:block" title="High">
              {formatNumber(ticker.high52w, 0)}
            </span>

            {/* Low */}
            <span className="text-slate-500 font-mono w-14 text-right shrink-0 hidden xl:block" title="Low">
              {formatNumber(ticker.low52w, 0)}
            </span>

            {/* Volume (compact) */}
            <span className="text-slate-500 font-mono w-14 text-right shrink-0 hidden xl:block" title="Volume">
              {formatCurrency(ticker.volume).replace('$', '')}
            </span>

            {/* Avg Volume */}
            <span className="text-slate-500 font-mono w-14 text-right shrink-0 hidden 2xl:block" title="Avg Vol">
              {formatCurrency(ticker.avgVolume).replace('$', '')}
            </span>

            {/* Market cap (compact) */}
            <span className="text-slate-500 font-mono w-14 text-right shrink-0 hidden 2xl:block" title="Mkt Cap">
              {formatCurrency(ticker.marketCap * 1_000_000)}
            </span>

            {/* P/E */}
            <span className="text-slate-500 font-mono w-10 text-right shrink-0 hidden 2xl:block" title="P/E">
              {ticker.pe > 0 ? formatNumber(ticker.pe, 1) : '-'}
            </span>
          </>
        ) : (
          <span className="text-slate-600 text-[10px] flex-1">Loading...</span>
        )}

        {/* Notes icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setNoteText(item.notes ?? '');
            setShowNotes(!showNotes);
          }}
          className={cn(
            'shrink-0 p-0.5 rounded transition-colors',
            item.notes
              ? 'text-blue-400 hover:text-blue-300'
              : 'text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100'
          )}
          title={item.notes ? 'Edit note' : 'Add note'}
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2h12v12H2zM5 5h6M5 8h6M5 11h3" />
          </svg>
        </button>

        {/* Bell icon for news subscription */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleNewsSubscription(groupId, item.symbol);
          }}
          className={cn(
            'shrink-0 p-0.5 rounded transition-colors',
            item.subscribedToNews
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-slate-600 hover:text-slate-400'
          )}
          title={item.subscribedToNews ? 'Unsubscribe from news' : 'Subscribe to news'}
        >
          {item.subscribedToNews ? (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a1 1 0 011 1v.5A4.5 4.5 0 0112.5 7v3l1.5 2H2l1.5-2V7A4.5 4.5 0 017 2.5V2a1 1 0 011-1zM6 13a2 2 0 004 0H6z" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1a1 1 0 011 1v.5A4.5 4.5 0 0112.5 7v3l1.5 2H2l1.5-2V7A4.5 4.5 0 017 2.5V2a1 1 0 011-1zM6 13a2 2 0 004 0H6z" />
              <line x1="2" y1="2" x2="14" y2="14" strokeWidth="2" />
            </svg>
          )}
        </button>

        {/* Remove button (visible on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeItem(groupId, item.symbol);
          }}
          className="shrink-0 p-0.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      {/* Notes inline editor */}
      {showNotes && (
        <div className="px-3 py-1.5 bg-slate-800/50 border-t border-slate-700/50">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveNotes();
              }
              if (e.key === 'Escape') setShowNotes(false);
            }}
            placeholder="Add a note..."
            rows={2}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-[10px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <div className="flex justify-end gap-1 mt-1">
            <button
              onClick={() => setShowNotes(false)}
              className="px-1.5 py-0.5 text-[9px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNotes}
              className="px-1.5 py-0.5 text-[9px] bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
