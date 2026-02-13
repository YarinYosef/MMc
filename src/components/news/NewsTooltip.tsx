'use client';

import { type NewsItem } from '@/data/types/news';
import { formatTime } from '@/lib/utils';

interface NewsTooltipProps {
  item: NewsItem;
  feedColor: string;
}

export function NewsTooltip({ item, feedColor }: NewsTooltipProps) {
  const impactLabel = item.impact >= 70 ? 'High' : item.impact >= 40 ? 'Medium' : 'Low';
  const impactColor = item.impact >= 70 ? 'text-red-400' : item.impact >= 40 ? 'text-yellow-400' : 'text-slate-400';

  return (
    <div className="max-w-xs p-3 space-y-2 text-xs">
      <div className="font-medium text-slate-200 leading-snug">{item.headline}</div>
      <div className="text-slate-400 leading-relaxed">{item.summary}</div>
      <div className="flex items-center gap-3 pt-1 border-t border-slate-600">
        <span className="text-slate-500">{formatTime(item.timestamp)}</span>
        <span className="uppercase text-slate-500">{item.source}</span>
        <span className={impactColor}>Impact: {impactLabel}</span>
      </div>
      {item.tickers.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap">
          {item.tickers.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono"
              style={{ backgroundColor: feedColor + '20', color: feedColor }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 text-[10px]">
        <span className="text-slate-500">Relevance: {item.relevanceScore}/100</span>
        <span
          className={
            item.sentiment === 'positive'
              ? 'text-green-400'
              : item.sentiment === 'negative'
                ? 'text-red-400'
                : 'text-slate-400'
          }
        >
          {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
        </span>
      </div>
    </div>
  );
}
