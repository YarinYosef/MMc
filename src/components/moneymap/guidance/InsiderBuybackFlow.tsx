'use client';

import { useMemo, useState } from 'react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generateInsiderTrades } from '@/data/generators/orderBookGenerator';
import { generatePriceHistory } from '@/data/generators/marketDataEngine';
import { formatCurrency } from '@/lib/utils';
import { formatVolume } from '@/data/generators/tickerGenerator';

export function InsiderBuybackFlow() {
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const getTicker = useMarketStore((s) => s.getTicker);
  const [highlightedIdx, setHighlightedIdx] = useState<number | null>(null);

  const ticker = selectedSymbol ? getTicker(selectedSymbol) : null;

  const { insiderTrades, chartData } = useMemo(() => {
    if (!ticker) return { insiderTrades: [], chartData: [] };

    const trades = generateInsiderTrades(ticker.symbol, ticker.price, 12);
    const history = generatePriceHistory(ticker, 30, 86400000);

    const chart = history.map((p) => {
      const dateStr = new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const matchingTrade = trades.find((t) => {
        const tradeDate = new Date(t.date).getTime();
        return Math.abs(tradeDate - p.timestamp) < 86400000 * 2;
      });

      return {
        date: dateStr,
        price: p.close,
        volume: p.volume,
        buySignal: matchingTrade?.type === 'buy' ? p.close : undefined,
        sellSignal: matchingTrade?.type === 'sell' ? p.close : undefined,
      };
    });

    return { insiderTrades: trades, chartData: chart };
  }, [ticker]);

  if (!selectedSymbol || !ticker) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-xs">
        Select a ticker to view insider activity
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-slate-400 px-2 pb-1">
        Insider trades & buybacks - {selectedSymbol}
      </div>

      {/* Chart area */}
      <div className="h-[45%] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 7, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="price"
              orientation="right"
              tick={{ fontSize: 7, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              tick={{ fontSize: 7, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 6, fontSize: 9 }}
              formatter={((value: number, name: string) => {
                if (name === 'volume') return [formatVolume(value), 'Volume'];
                if (name === 'price') return [`$${value.toFixed(2)}`, 'Price'];
                if (name === 'buySignal') return [`$${value.toFixed(2)}`, 'Buy'];
                if (name === 'sellSignal') return [`$${value.toFixed(2)}`, 'Sell'];
                return [value, name];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any}
            />
            <Bar yAxisId="volume" dataKey="volume" fill="rgba(100,116,139,0.2)" barSize={8} />
            <Line yAxisId="price" dataKey="price" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
            <Line
              yAxisId="price"
              dataKey="buySignal"
              stroke="none"
              dot={{ fill: '#22C55E', r: 5, strokeWidth: 2, stroke: '#22C55E' }}
              connectNulls={false}
            />
            <Line
              yAxisId="price"
              dataKey="sellSignal"
              stroke="none"
              dot={{ fill: '#EF4444', r: 5, strokeWidth: 2, stroke: '#EF4444' }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table area */}
      <div className="flex-1 min-h-0 overflow-y-auto border-t border-slate-700/50">
        <table className="w-full text-[9px]">
          <thead className="sticky top-0 bg-slate-800/90">
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-1 px-1.5 font-medium">Date</th>
              <th className="text-left py-1 px-1.5 font-medium">Insider</th>
              <th className="text-left py-1 px-1.5 font-medium">Title</th>
              <th className="text-center py-1 px-1.5 font-medium">Type</th>
              <th className="text-right py-1 px-1.5 font-medium">Shares</th>
              <th className="text-right py-1 px-1.5 font-medium">Price</th>
              <th className="text-right py-1 px-1.5 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {insiderTrades.map((trade, i) => (
              <tr
                key={i}
                className={`border-b border-slate-700/30 cursor-pointer ${
                  highlightedIdx === i ? 'bg-slate-700/40' : 'hover:bg-slate-700/20'
                }`}
                onClick={() => setHighlightedIdx(highlightedIdx === i ? null : i)}
              >
                <td className="py-1 px-1.5 text-slate-400">{trade.date}</td>
                <td className="py-1 px-1.5 text-slate-200">{trade.insider}</td>
                <td className="py-1 px-1.5 text-slate-500">{trade.title}</td>
                <td className="py-1 px-1.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                    trade.type === 'buy'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-1 px-1.5 text-right text-slate-300">{trade.shares.toLocaleString()}</td>
                <td className="py-1 px-1.5 text-right text-slate-300">${trade.price.toFixed(2)}</td>
                <td className="py-1 px-1.5 text-right text-slate-200 font-medium">{formatCurrency(trade.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
