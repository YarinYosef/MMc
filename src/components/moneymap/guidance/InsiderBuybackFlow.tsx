'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
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
  const tableRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll table to highlighted row
  useEffect(() => {
    if (highlightedIdx == null || !tableRef.current) return;
    const row = tableRef.current.querySelector(`[data-row-idx="${highlightedIdx}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlightedIdx]);

  // Custom dot renderers with click-to-highlight
  const renderBuyDot = useCallback((props: { cx?: number; cy?: number; payload?: Record<string, unknown> }) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload || payload.buySignal == null) return <circle r={0} />;
    const idx = insiderTrades.findIndex((t) => {
      const tradeDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return tradeDate === payload.date && t.type === 'buy';
    });
    const isHighlighted = idx !== -1 && highlightedIdx === idx;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isHighlighted ? 7 : 5}
        fill="#2EC08B"
        stroke={isHighlighted ? '#fff' : '#2EC08B'}
        strokeWidth={isHighlighted ? 2 : 2}
        style={{ cursor: 'pointer', transition: 'r 0.15s' }}
        onClick={(e) => {
          e.stopPropagation();
          if (idx !== -1) setHighlightedIdx(highlightedIdx === idx ? null : idx);
        }}
      />
    );
  }, [insiderTrades, highlightedIdx]);

  const renderSellDot = useCallback((props: { cx?: number; cy?: number; payload?: Record<string, unknown> }) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload || payload.sellSignal == null) return <circle r={0} />;
    const idx = insiderTrades.findIndex((t) => {
      const tradeDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return tradeDate === payload.date && t.type === 'sell';
    });
    const isHighlighted = idx !== -1 && highlightedIdx === idx;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isHighlighted ? 7 : 5}
        fill="#FF7243"
        stroke={isHighlighted ? '#fff' : '#FF7243'}
        strokeWidth={isHighlighted ? 2 : 2}
        style={{ cursor: 'pointer', transition: 'r 0.15s' }}
        onClick={(e) => {
          e.stopPropagation();
          if (idx !== -1) setHighlightedIdx(highlightedIdx === idx ? null : idx);
        }}
      />
    );
  }, [insiderTrades, highlightedIdx]);

  if (!selectedSymbol || !ticker) {
    return (
      <div className="h-full flex items-center justify-center text-[#999999] text-xs">
        Select a ticker to view insider activity
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">
        Insider trades & buybacks - {selectedSymbol}
      </div>

      {/* Chart area */}
      <div className="h-[45%] min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="price"
              orientation="right"
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 9 }}
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
            <Line yAxisId="price" dataKey="price" stroke="#AB9FF2" strokeWidth={1.5} dot={false} />
            <Line
              yAxisId="price"
              dataKey="buySignal"
              stroke="none"
              dot={renderBuyDot}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="price"
              dataKey="sellSignal"
              stroke="none"
              dot={renderSellDot}
              connectNulls={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table area */}
      <div ref={tableRef} className="flex-1 min-h-0 overflow-y-auto border-t border-white/[0.08]">
        <table className="w-full text-[10px]">
          <thead className="sticky top-0 bg-[#131313]/90">
            <tr className="text-[#999999] border-b border-black">
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
                data-row-idx={i}
                className={`border-b border-white/[0.05] cursor-pointer transition-colors ${
                  highlightedIdx === i ? 'bg-[#AB9FF2]/20 ring-1 ring-[#AB9FF2]/40' : 'hover:bg-white/[0.03]'
                }`}
                onClick={() => setHighlightedIdx(highlightedIdx === i ? null : i)}
              >
                <td className="py-1 px-1.5 text-[#999999]">{trade.date}</td>
                <td className="py-1 px-1.5 text-white">{trade.insider}</td>
                <td className="py-1 px-1.5 text-[#999999]">{trade.title}</td>
                <td className="py-1 px-1.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    trade.type === 'buy'
                      ? 'bg-[#2EC08B]/20 text-[#2EC08B]'
                      : 'bg-[#FF7243]/20 text-[#FF7243]'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-1 px-1.5 text-right text-[#999999]">{trade.shares.toLocaleString()}</td>
                <td className="py-1 px-1.5 text-right text-[#999999]">${trade.price.toFixed(2)}</td>
                <td className="py-1 px-1.5 text-right text-white font-medium">{formatCurrency(trade.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
