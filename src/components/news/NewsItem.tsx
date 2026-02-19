'use client';

import { memo, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { type NewsItem as NewsItemType } from '@/data/types/news';
import { cn, formatRelativeTime } from '@/lib/utils';
import { NewsTooltip } from './NewsTooltip';

interface NewsItemProps {
  item: NewsItemType;
  feedColor: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const SENTIMENT_COLORS = {
  positive: 'text-[#2EC08B]',
  neutral: 'text-[#999999]',
  negative: 'text-[#FF7243]',
};

const SENTIMENT_DOT = {
  positive: 'bg-[#2EC08B]',
  neutral: 'bg-[#777777]',
  negative: 'bg-[#FF7243]',
};

export const NewsItemRow = memo(function NewsItemRow({ item, feedColor, isSelected, onSelect }: NewsItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      if (rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        setTooltipPos({
          top: rect.top - 4,
          left: rect.left + rect.width / 2,
        });
      }
      setShowTooltip(true);
    }, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  }, []);

  return (
    <div ref={rowRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        onClick={() => onSelect(item.id)}
        className={cn(
          'w-full flex items-start gap-1.5 py-2 px-2 text-left border-b border-white/[0.03]',
          'hover:bg-white/[0.08] cursor-pointer text-[12px] leading-normal transition-colors',
          isSelected && 'bg-white/[0.08]'
        )}
      >
        <span
          className={cn('shrink-0 w-2 h-2 rounded-full mt-1', SENTIMENT_DOT[item.sentiment])}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className={cn('flex-1 truncate', SENTIMENT_COLORS[item.sentiment])}>
              {item.headline}
            </span>
            {item.tickers.length > 0 && (
              <span
                className="shrink-0 text-[10px] font-mono px-1 rounded"
                style={{ color: feedColor }}
              >
                {item.tickers[0]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[#666666] text-[10px] font-mono uppercase">
              {item.source.slice(0, 4)}
            </span>
            <span className="text-[#555555] text-[10px]">&middot;</span>
            <span className="text-[#666666] text-[10px] font-mono">
              {formatRelativeTime(item.timestamp)}
            </span>
            {item.summary && (
              <>
                <span className="text-[#555555] text-[10px]">&middot;</span>
                <span className="text-[#555555] text-[10px] truncate">
                  {item.summary}
                </span>
              </>
            )}
          </div>
        </div>
      </button>
      {showTooltip && createPortal(
        <div
          className="fixed z-[70] -translate-x-1/2 -translate-y-full rounded-md bg-[#131313] border border-black shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none"
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <NewsTooltip item={item} feedColor={feedColor} />
        </div>,
        document.body
      )}
    </div>
  );
});
