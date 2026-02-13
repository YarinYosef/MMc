'use client';

import { type NewsItem as NewsItemType } from '@/data/types/news';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { NewsTooltip } from './NewsTooltip';

interface NewsItemProps {
  item: NewsItemType;
  feedColor: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const SENTIMENT_COLORS = {
  positive: 'text-green-400',
  neutral: 'text-slate-400',
  negative: 'text-red-400',
};

const SENTIMENT_DOT = {
  positive: 'bg-green-400',
  neutral: 'bg-slate-500',
  negative: 'bg-red-400',
};

export function NewsItemRow({ item, feedColor, isSelected, onSelect }: NewsItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => onSelect(item.id)}
          className={cn(
            'w-full flex items-start gap-1.5 py-0.5 px-1.5 text-left',
            'hover:bg-slate-800/60 cursor-pointer text-[11px] leading-tight transition-colors',
            isSelected && 'bg-slate-800/80'
          )}
        >
          <span className="text-slate-600 shrink-0 w-10 font-mono">
            {formatRelativeTime(item.timestamp)}
          </span>
          <span className="text-slate-600 shrink-0 w-6 uppercase text-[9px] font-mono">
            {item.source.slice(0, 4)}
          </span>
          <span
            className={cn('shrink-0 w-1.5 h-1.5 rounded-full mt-1', SENTIMENT_DOT[item.sentiment])}
          />
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
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-0 bg-slate-800 border border-slate-600">
        <NewsTooltip item={item} feedColor={feedColor} />
      </TooltipContent>
    </Tooltip>
  );
}
