'use client';

import { useMemo, useState } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generateInsiderTrades } from '@/data/generators/orderBookGenerator';
import { generatePriceHistory } from '@/data/generators/marketDataEngine';
import { formatCurrency, cn } from '@/lib/utils';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Scatter,
} from 'recharts';
import { CHART_COLORS } from '@/data/constants/colors';

type InsiderTimeframe = '3mo' | '6mo' | '1yr';

const TIMEFRAME_CONFIG: Record<InsiderTimeframe, { days: number; label: string }> = {
  '3mo': { days: 90, label: '3M' },
  '6mo': { days: 180, label: '6M' },
  '1yr': { days: 365, label: '1Y' },
};

export function InsiderSection({ symbol }: { symbol: string }) {
  const ticker = useMarketStore((s) => s.tickers.get(symbol));
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);
  const [timeframe, setTimeframe] = useState<InsiderTimeframe>('6mo');

  // Stable timestamp - does not change on re-renders
  const [stableNow] = useState(() => Date.now());

  const tickerPrice = ticker?.price;

  const trades = useMemo(() => {
    if (tickerPrice == null) return [];
    return generateInsiderTrades(symbol, tickerPrice, 12);
  }, [symbol, tickerPrice]);

  const priceData = useMemo(() => {
    if (!ticker) return [];
    const config = TIMEFRAME_CONFIG[timeframe];
    const points = Math.floor(config.days / 1.4); // trading days
    return generatePriceHistory(ticker, points, 86400000);
  }, [ticker, timeframe]);

  const chartData = useMemo(() => {
    const cutoff = stableNow - TIMEFRAME_CONFIG[timeframe].days * 86400000;

    // Build price line data
    const data = priceData.map((p) => ({
      date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: p.timestamp,
      price: p.close,
      buy: undefined as number | undefined,
      sell: undefined as number | undefined,
    }));

    // Overlay insider trades
    trades.forEach((trade) => {
      const tradeTime = new Date(trade.date).getTime();
      if (tradeTime < cutoff) return;

      // Find closest data point
      let closest = 0;
      let minDiff = Infinity;
      data.forEach((d, i) => {
        const diff = Math.abs(d.timestamp - tradeTime);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });

      if (data[closest]) {
        if (trade.type === 'buy') {
          data[closest].buy = trade.price;
        } else {
          data[closest].sell = trade.price;
        }
      }
    });

    return data;
  }, [priceData, trades, timeframe, stableNow]);

  // Trade summary
  const filteredTrades = useMemo(() => {
    const cutoff = stableNow - TIMEFRAME_CONFIG[timeframe].days * 86400000;
    return trades.filter((t) => new Date(t.date).getTime() >= cutoff);
  }, [trades, timeframe, stableNow]);

  const totalBuys = filteredTrades.filter((t) => t.type === 'buy').reduce((s, t) => s + t.value, 0);
  const totalSells = filteredTrades.filter((t) => t.type === 'sell').reduce((s, t) => s + t.value, 0);
  const buyCount = filteredTrades.filter((t) => t.type === 'buy').length;
  const sellCount = filteredTrades.filter((t) => t.type === 'sell').length;

  if (!ticker) return null;

  return (
    <div className="space-y-2">
      {/* Timeframe */}
      <div className="flex items-center gap-1">
        {(Object.keys(TIMEFRAME_CONFIG) as InsiderTimeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={cn(
              'px-2 py-0.5 text-[9px] rounded transition-colors',
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            )}
          >
            {TIMEFRAME_CONFIG[tf].label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="text-[9px] text-slate-500">Buys ({buyCount})</div>
          <div className="text-[11px] font-mono text-green-400">
            {formatCurrency(totalBuys)}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded p-1.5">
          <div className="text-[9px] text-slate-500">Sells ({sellCount})</div>
          <div className="text-[11px] font-mono text-red-400">
            {formatCurrency(totalSells)}
          </div>
        </div>
      </div>

      {/* Chart with price line and insider markers */}
      <div
        className="h-44 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setExpandedChart({ section: 'insider', chartId: 'insider' })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 8, fill: CHART_COLORS.textMuted }}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.border }}
            />
            <YAxis
              tick={{ fontSize: 8, fill: CHART_COLORS.textMuted }}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              width={40}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.border }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                background: CHART_COLORS.surface,
                border: `1px solid ${CHART_COLORS.border}`,
                borderRadius: '4px',
                fontSize: '10px',
                color: CHART_COLORS.text,
              }}
              formatter={((value: unknown, name: string) => {
                const num = typeof value === 'number' ? value : Number(value) || 0;
                return [
                  `$${num.toFixed(2)}`,
                  name === 'buy' ? 'Insider Buy' : name === 'sell' ? 'Insider Sell' : 'Price',
                ];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={CHART_COLORS.accent}
              strokeWidth={1.5}
              dot={false}
              animationDuration={300}
            />
            <Scatter
              dataKey="buy"
              fill={CHART_COLORS.positive}
              shape="triangle"
              legendType="none"
            />
            <Scatter
              dataKey="sell"
              fill={CHART_COLORS.negative}
              shape="diamond"
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Recent trades table */}
      <div className="space-y-0.5">
        <div className="text-[9px] text-slate-500 font-medium mb-1">Recent Trades</div>
        {filteredTrades.slice(0, 5).map((trade, i) => (
          <div key={i} className="flex items-center justify-between text-[9px] py-0.5">
            <div className="flex items-center gap-1.5">
              <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                {trade.type === 'buy' ? '\u25B2' : '\u25BC'}
              </span>
              <span className="text-slate-300">{trade.insider}</span>
              <span className="text-slate-600">({trade.title})</span>
            </div>
            <span className="text-slate-400 font-mono">{formatCurrency(trade.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
