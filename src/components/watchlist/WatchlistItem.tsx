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

  const changeColor = ticker && ticker.change >= 0 ? 'text-[#2EC08B]' : 'text-[#FF7243]';

  return (
    <div className={cn(isDragging && 'opacity-50')}>
      <div
        className="group flex items-center gap-1 px-2 py-1 hover:bg-white/[0.06] transition-colors cursor-pointer text-xs min-w-max"
      >
        {/* Color indicator */}
        <span
          className="w-1 h-6 rounded-full shrink-0"
          style={{ backgroundColor: groupColor }}
        />

        {/* Symbol + click to select */}
        <button
          onClick={handleClick}
          className="font-medium text-white w-12 text-left shrink-0 hover:text-white transition-colors"
        >
          {item.symbol}
        </button>

        {ticker ? (
          <>
            {/* Last price */}
            <span className="text-[#999999] font-mono w-16 text-right shrink-0">
              ${formatNumber(ticker.price)}
            </span>

            {/* Change % */}
            <span className={cn('font-mono w-14 text-right shrink-0', changeColor)}>
              {ticker.changePercent >= 0 ? '+' : ''}{formatNumber(ticker.changePercent)}%
            </span>

            {/* Prev Close */}
            <span className="text-[#999999] font-mono w-14 text-right shrink-0" title="Prev Close">
              {formatNumber(ticker.previousClose)}
            </span>

            {/* High */}
            <span className="text-[#999999] font-mono w-14 text-right shrink-0" title="High">
              {formatNumber(ticker.high52w, 0)}
            </span>

            {/* Low */}
            <span className="text-[#999999] font-mono w-14 text-right shrink-0" title="Low">
              {formatNumber(ticker.low52w, 0)}
            </span>

            {/* Volume (compact) */}
            <span className="text-[#999999] font-mono w-14 text-right shrink-0" title="Volume">
              {formatCurrency(ticker.volume).replace('$', '')}
            </span>

            {/* Avg Volume */}
            <span className="text-[#999999] font-mono w-14 text-right shrink-0" title="Avg Vol">
              {formatCurrency(ticker.avgVolume).replace('$', '')}
            </span>

            {/* Market cap (compact) */}
            <span className="text-[#999999] font-mono w-14 text-right shrink-0" title="Mkt Cap">
              {formatCurrency(ticker.marketCap * 1_000_000)}
            </span>

            {/* P/E */}
            <span className="text-[#999999] font-mono w-10 text-right shrink-0" title="P/E">
              {ticker.pe > 0 ? formatNumber(ticker.pe, 1) : '-'}
            </span>
          </>
        ) : (
          <span className="text-[#999999] text-[10px] flex-1">Loading...</span>
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
              ? 'text-[#AB9FF2] hover:text-[#AB9FF2]'
              : 'text-[#777777] hover:text-[#999999] opacity-0 group-hover:opacity-100'
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
              ? 'text-[#CD8554] hover:text-[#CD8554]'
              : 'text-[#777777] hover:text-[#999999]'
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
          className="shrink-0 p-0.5 text-[#777777] hover:text-[#FF7243] opacity-0 group-hover:opacity-100 transition-all"
          title="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      {/* Notes inline editor */}
      {showNotes && (
        <div className="px-3 py-1.5 bg-white/[0.03] border-t border-white/[0.08]">
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
            className="w-full bg-white/[0.06] border border-black rounded px-2 py-1 text-[10px] text-white placeholder:text-[#777777] focus:outline-none focus:ring-1 focus:ring-[#AB9FF2] resize-none"
          />
          <div className="flex justify-end gap-1 mt-1">
            <button
              onClick={() => setShowNotes(false)}
              className="px-1.5 py-0.5 text-[9px] text-[#777777] hover:text-[#999999] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNotes}
              className="px-1.5 py-0.5 text-[9px] bg-[#AB9FF2] hover:brightness-110 text-white rounded transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
