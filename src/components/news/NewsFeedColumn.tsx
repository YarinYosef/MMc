'use client';

import { useRef, useEffect } from 'react';
import { type NewsItem } from '@/data/types/news';
import { type NewsFeedConfig } from '@/data/types/news';
import { NewsItemRow } from './NewsItem';
import { useNewsStore } from '@/stores/useNewsStore';

interface NewsFeedColumnProps {
  feed: NewsFeedConfig;
  items: NewsItem[];
}

export function NewsFeedColumn({ feed, items }: NewsFeedColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScroll = useNewsStore((s) => s.autoScroll);
  const selectedItemId = useNewsStore((s) => s.selectedItemId);
  const selectItem = useNewsStore((s) => s.selectItem);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [items.length, autoScroll]);

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800 last:border-r-0">
      {/* Column header */}
      <div
        className="flex items-center gap-1.5 px-2 py-1 border-b border-slate-800 shrink-0"
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: feed.color }}
        />
        <span
          className="text-[10px] font-semibold uppercase tracking-wider truncate"
          style={{ color: feed.color }}
        >
          {feed.label}
        </span>
        <span className="text-[9px] text-slate-600 ml-auto shrink-0">
          {items.length}
        </span>
      </div>

      {/* Scrollable news items */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-2 py-3 text-[10px] text-slate-600 text-center">
            No news yet...
          </div>
        ) : (
          items.map((item) => (
            <NewsItemRow
              key={item.id}
              item={item}
              feedColor={feed.color}
              isSelected={selectedItemId === item.id}
              onSelect={selectItem}
            />
          ))
        )}
      </div>
    </div>
  );
}
