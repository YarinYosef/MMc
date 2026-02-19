'use client';

import { useMemo } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generateOrderBook } from '@/data/generators/orderBookGenerator';
import { cn } from '@/lib/utils';
import { ButterflyChart } from './ButterflyChart';

export function OrderBookSection({ symbol, expanded }: { symbol: string; expanded?: boolean }) {
  const ticker = useMarketStore((s) => s.tickers.get(symbol));
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);

  const price = ticker?.price;
  const orderBook = useMemo(() => {
    if (price == null) return null;
    return generateOrderBook(price, 20);
  }, [price]);

  if (!ticker || !orderBook) return null;

  const totalBidVolume = orderBook.bids.reduce((sum, b) => sum + b.size, 0);
  const totalAskVolume = orderBook.asks.reduce((sum, a) => sum + a.size, 0);
  const imbalance = ((totalBidVolume - totalAskVolume) / (totalBidVolume + totalAskVolume)) * 100;
  const bidPercent = (totalBidVolume / (totalBidVolume + totalAskVolume)) * 100;

  return (
    <div className="space-y-2">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.03] rounded p-1.5">
          <div className="text-[10px] text-[#777777]">Spread</div>
          <div className="text-[11px] font-mono text-white">
            ${orderBook.spread.toFixed(2)} ({orderBook.spreadPercent.toFixed(3)}%)
          </div>
        </div>
        <div className="bg-white/[0.03] rounded p-1.5">
          <div className="text-[10px] text-[#777777]">Imbalance</div>
          <div className={cn(
            'text-[11px] font-mono',
            imbalance > 0 ? 'text-[#2EC08B]' : 'text-[#FF7243]'
          )}>
            {imbalance > 0 ? '+' : ''}{imbalance.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Buy/Sell pressure bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] mb-0.5">
          <span className="text-[#2EC08B]">Buy {bidPercent.toFixed(1)}%</span>
          <span className="text-[#FF7243]">{(100 - bidPercent).toFixed(1)}% Sell</span>
        </div>
        <div className="h-2 flex rounded overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${bidPercent}%`, backgroundColor: '#2EC08B' }}
          />
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${100 - bidPercent}%`, backgroundColor: '#FF7243' }}
          />
        </div>
      </div>

      {/* Volume totals */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-[10px] text-[#777777]">Total Bid Vol</div>
          <div className="text-[11px] font-mono text-[#2EC08B]">
            {totalBidVolume.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#777777]">Total Ask Vol</div>
          <div className="text-[11px] font-mono text-[#FF7243]">
            {totalAskVolume.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Butterfly Chart */}
      <div
        className={!expanded ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
        onClick={expanded ? undefined : () => setExpandedChart({ section: 'orderbook', chartId: 'butterfly' })}
      >
        <ButterflyChart orderBook={orderBook} height={expanded ? 500 : 200} expanded={expanded} />
      </div>
    </div>
  );
}
