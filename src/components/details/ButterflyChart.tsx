'use client';

import { type OrderBook } from '@/data/types/market';

interface ButterflyChartProps {
  orderBook: OrderBook;
  height?: number;
  expanded?: boolean;
}

export function ButterflyChart({ orderBook, height = 200, expanded = false }: ButterflyChartProps) {
  const maxTotal = Math.max(
    orderBook.bids[orderBook.bids.length - 1]?.total ?? 0,
    orderBook.asks[orderBook.asks.length - 1]?.total ?? 0,
    1
  );

  const levels = Math.min(orderBook.bids.length, orderBook.asks.length, expanded ? 20 : 15);

  const fontSize = expanded ? 'text-[11px]' : 'text-[10px]';
  const headerSize = expanded ? 'text-[10px]' : 'text-[9px]';
  const rowPy = expanded ? 'py-[3px]' : 'py-[1.5px]';
  const colPx = expanded ? 'px-2' : 'px-1';

  return (
    <div className="w-full" style={{ height }}>
      {/* Spread indicator */}
      <div className="flex items-center justify-center mb-1">
        <span className="bg-white/[0.06] border border-white/[0.08] rounded px-1.5 py-0.5 text-[9px] font-mono text-[#999999]">
          Spread: ${orderBook.spread.toFixed(2)} ({orderBook.spreadPercent.toFixed(3)}%)
        </span>
      </div>

      {/* Column headers */}
      <div className="flex items-center w-full">
        {/* Bid headers - right to left: Total | Size | Price */}
        <div className="flex-1 flex items-center">
          <div className={`flex-1 text-left ${colPx} ${headerSize} text-[#777777] font-medium`}>Total</div>
          <div className={`flex-1 text-right ${colPx} ${headerSize} text-[#777777] font-medium`}>Size</div>
          <div className={`flex-1 text-right ${colPx} ${headerSize} text-[#777777] font-medium`}>Bid</div>
        </div>
        {/* Spacer */}
        <div className="w-1 shrink-0" />
        {/* Ask headers - left to right: Price | Size | Total */}
        <div className="flex-1 flex items-center">
          <div className={`flex-1 text-left ${colPx} ${headerSize} text-[#777777] font-medium`}>Ask</div>
          <div className={`flex-1 text-left ${colPx} ${headerSize} text-[#777777] font-medium`}>Size</div>
          <div className={`flex-1 text-right ${colPx} ${headerSize} text-[#777777] font-medium`}>Total</div>
        </div>
      </div>

      {/* Order book rows */}
      <div className="overflow-hidden" style={{ height: height - 38 }}>
        {Array.from({ length: levels }).map((_, i) => {
          const bid = orderBook.bids[i];
          const ask = orderBook.asks[i];
          if (!bid || !ask) return null;

          const bidDepthPct = (bid.total / maxTotal) * 100;
          const askDepthPct = (ask.total / maxTotal) * 100;

          return (
            <div
              key={i}
              className="flex items-center w-full hover:bg-white/[0.03] transition-colors border-b border-black/50"
            >
              {/* Bid side */}
              <div className="flex-1 flex items-center relative overflow-hidden">
                {/* Depth bar growing leftward */}
                <div
                  className="absolute right-0 top-0 bottom-0 transition-all duration-150"
                  style={{
                    width: `${bidDepthPct}%`,
                    backgroundColor: 'rgba(34, 197, 94, 0.18)',
                  }}
                />
                <div className={`flex-1 text-left ${colPx} ${rowPy} ${fontSize} font-mono text-[#999999] relative z-10 tabular-nums`}>
                  {bid.total.toLocaleString()}
                </div>
                <div className={`flex-1 text-right ${colPx} ${rowPy} ${fontSize} font-mono text-white relative z-10 tabular-nums`}>
                  {bid.size.toLocaleString()}
                </div>
                <div className={`flex-1 text-right ${colPx} ${rowPy} ${fontSize} font-mono text-green-400 relative z-10 tabular-nums`}>
                  ${bid.price.toFixed(2)}
                </div>
              </div>

              {/* Center gap */}
              <div className="w-1 shrink-0 bg-white/[0.03]" />

              {/* Ask side */}
              <div className="flex-1 flex items-center relative overflow-hidden">
                {/* Depth bar growing rightward */}
                <div
                  className="absolute left-0 top-0 bottom-0 transition-all duration-150"
                  style={{
                    width: `${askDepthPct}%`,
                    backgroundColor: 'rgba(239, 68, 68, 0.18)',
                  }}
                />
                <div className={`flex-1 text-left ${colPx} ${rowPy} ${fontSize} font-mono text-red-400 relative z-10 tabular-nums`}>
                  ${ask.price.toFixed(2)}
                </div>
                <div className={`flex-1 text-left ${colPx} ${rowPy} ${fontSize} font-mono text-white relative z-10 tabular-nums`}>
                  {ask.size.toLocaleString()}
                </div>
                <div className={`flex-1 text-right ${colPx} ${rowPy} ${fontSize} font-mono text-[#999999] relative z-10 tabular-nums`}>
                  {ask.total.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
