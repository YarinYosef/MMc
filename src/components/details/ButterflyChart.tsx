'use client';

import { type OrderBook } from '@/data/types/market';
import { CHART_COLORS } from '@/data/constants/colors';

interface ButterflyChartProps {
  orderBook: OrderBook;
  height?: number;
}

export function ButterflyChart({ orderBook, height = 200 }: ButterflyChartProps) {
  const maxTotal = Math.max(
    orderBook.bids[orderBook.bids.length - 1]?.total ?? 0,
    orderBook.asks[orderBook.asks.length - 1]?.total ?? 0,
    1
  );

  const levels = Math.min(orderBook.bids.length, orderBook.asks.length, 15);
  const rowHeight = Math.max(height / levels, 12);

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1 px-1">
        <span>Bids</span>
        <span>Price</span>
        <span>Asks</span>
      </div>
      <div className="relative overflow-hidden" style={{ height: height - 20 }}>
        {Array.from({ length: levels }).map((_, i) => {
          const bid = orderBook.bids[i];
          const ask = orderBook.asks[i];
          if (!bid || !ask) return null;

          const bidWidth = (bid.total / maxTotal) * 100;
          const askWidth = (ask.total / maxTotal) * 100;

          return (
            <div
              key={i}
              className="flex items-center"
              style={{ height: rowHeight }}
            >
              {/* Bid side */}
              <div className="flex-1 flex items-center justify-end relative">
                <div
                  className="absolute right-0 h-[70%] rounded-l transition-all duration-200"
                  style={{
                    width: `${bidWidth}%`,
                    backgroundColor: `${CHART_COLORS.positive}30`,
                    borderRight: `2px solid ${CHART_COLORS.positive}`,
                  }}
                />
                <span className="relative z-10 text-[8px] font-mono text-green-400 pr-1">
                  {bid.size.toLocaleString()}
                </span>
              </div>

              {/* Price column */}
              <div className="w-16 text-center shrink-0">
                <span className="text-[8px] font-mono text-slate-400">
                  ${bid.price.toFixed(2)}
                </span>
              </div>

              {/* Ask side */}
              <div className="flex-1 flex items-center relative">
                <div
                  className="absolute left-0 h-[70%] rounded-r transition-all duration-200"
                  style={{
                    width: `${askWidth}%`,
                    backgroundColor: `${CHART_COLORS.negative}30`,
                    borderLeft: `2px solid ${CHART_COLORS.negative}`,
                  }}
                />
                <span className="relative z-10 text-[8px] font-mono text-red-400 pl-1">
                  {ask.size.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
