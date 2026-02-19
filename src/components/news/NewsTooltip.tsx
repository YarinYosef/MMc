'use client';

import { type NewsItem } from '@/data/types/news';
import { formatTime } from '@/lib/utils';

interface NewsTooltipProps {
  item: NewsItem;
  feedColor: string;
}

export function NewsTooltip({ item, feedColor }: NewsTooltipProps) {
  const impactLabel = item.impact >= 70 ? 'High' : item.impact >= 40 ? 'Medium' : 'Low';
  const impactColor = item.impact >= 70 ? 'text-[#FF7243]' : item.impact >= 40 ? 'text-[#CD8554]' : 'text-[#999999]';

  return (
    <div className="max-w-xs p-3 space-y-2 text-xs">
      <div className="font-medium text-white leading-snug">{item.headline}</div>
      <div className="text-[#999999] leading-relaxed">{item.summary}</div>
      <div className="flex items-center gap-3 pt-1 border-t border-black">
        <span className="text-[#999999]">{formatTime(item.timestamp)}</span>
        <span className="uppercase text-[#999999]">{item.source}</span>
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
        <span className="text-[#999999]">Relevance: {item.relevanceScore}/100</span>
        <span
          className={
            item.sentiment === 'positive'
              ? 'text-[#2EC08B]'
              : item.sentiment === 'negative'
                ? 'text-[#FF7243]'
                : 'text-[#999999]'
          }
        >
          {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
        </span>
      </div>
    </div>
  );
}
