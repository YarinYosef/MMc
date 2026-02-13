'use client';

import { useMemo } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generateOrderBook } from '@/data/generators/orderBookGenerator';
import { cn } from '@/lib/utils';
import { ButterflyChart } from './ButterflyChart';

export function OrderBookSection({ symbol }: { symbol: string }) {
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
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="text-[9px] text-slate-500">Spread</div>
          <div className="text-[11px] font-mono text-slate-200">
            ${orderBook.spread.toFixed(2)} ({orderBook.spreadPercent.toFixed(3)}%)
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="text-[9px] text-slate-500">Imbalance</div>
          <div className={cn(
            'text-[11px] font-mono',
            imbalance > 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {imbalance > 0 ? '+' : ''}{imbalance.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Buy/Sell pressure bar */}
      <div>
        <div className="flex items-center justify-between text-[9px] mb-0.5">
          <span className="text-green-400">Buy {bidPercent.toFixed(1)}%</span>
          <span className="text-red-400">{(100 - bidPercent).toFixed(1)}% Sell</span>
        </div>
        <div className="h-2 flex rounded overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${bidPercent}%`, backgroundColor: '#22C55E' }}
          />
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${100 - bidPercent}%`, backgroundColor: '#EF4444' }}
          />
        </div>
      </div>

      {/* Volume totals */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center">
          <div className="text-[9px] text-slate-500">Total Bid Vol</div>
          <div className="text-[10px] font-mono text-green-400">
            {totalBidVolume.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-slate-500">Total Ask Vol</div>
          <div className="text-[10px] font-mono text-red-400">
            {totalAskVolume.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Butterfly Chart */}
      <div
        className="cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setExpandedChart({ section: 'orderbook', chartId: 'butterfly' })}
      >
        <ButterflyChart orderBook={orderBook} height={200} />
      </div>
    </div>
  );
}
