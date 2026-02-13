'use client';

import { useMemo, useState } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generatePriceHistory } from '@/data/generators/marketDataEngine';
import { formatCurrency, cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CHART_COLORS } from '@/data/constants/colors';

type PricePeriod = '6mo' | '1yr' | '5yr' | '10yr';

const PERIOD_CONFIG: Record<PricePeriod, { points: number; interval: number; label: string }> = {
  '6mo': { points: 130, interval: 86400000, label: '6M' },
  '1yr': { points: 252, interval: 86400000, label: '1Y' },
  '5yr': { points: 260, interval: 86400000 * 5, label: '5Y' },
  '10yr': { points: 520, interval: 86400000 * 5, label: '10Y' },
};

interface MetricProps {
  label: string;
  value: string;
  color?: string;
}

function Metric({ label, value, color }: MetricProps) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-[10px] text-slate-500">{label}</span>
      <span className={cn('text-[10px] font-mono', color || 'text-slate-200')}>{value}</span>
    </div>
  );
}

export function FundamentalsSection({ symbol }: { symbol: string }) {
  const ticker = useMarketStore((s) => s.tickers.get(symbol));
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);
  const [period, setPeriod] = useState<PricePeriod>('1yr');

  const tickerSymbol = ticker?.symbol;
  const tickerPe = ticker?.pe;

  const priceData = useMemo(() => {
    if (!ticker) return [];
    const config = PERIOD_CONFIG[period];
    const history = generatePriceHistory(ticker, config.points, config.interval);
    return history.map((p) => ({
      date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: p.close,
    }));
  }, [ticker, period]);

  const forwardPE = useMemo(() => {
    if (!tickerSymbol || tickerPe == null) return 0;
    // Deterministic jitter based on ticker symbol
    let hash = 0;
    for (let i = 0; i < tickerSymbol.length; i++) {
      hash = ((hash << 5) - hash + tickerSymbol.charCodeAt(i)) | 0;
    }
    const jitter = 0.85 + (((hash >>> 0) % 1500) / 10000);
    return tickerPe * jitter;
  }, [tickerPe, tickerSymbol]);

  if (!ticker) return null;

  return (
    <div className="space-y-2">
      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-0">
        <Metric label="Market Cap" value={formatCurrency(ticker.marketCap)} />
        <Metric label="Volume" value={formatCurrency(ticker.volume).replace('$', '')} />
        <Metric label="P/E" value={ticker.pe.toFixed(1)} />
        <Metric label="Avg Vol" value={formatCurrency(ticker.avgVolume).replace('$', '')} />
        <Metric label="Fwd P/E" value={forwardPE.toFixed(1)} />
        <Metric label="EPS" value={`$${ticker.eps.toFixed(2)}`} />
        <Metric label="52W High" value={`$${ticker.high52w.toFixed(2)}`} />
        <Metric label="52W Low" value={`$${ticker.low52w.toFixed(2)}`} />
        <Metric label="Beta" value={ticker.beta.toFixed(2)} />
        <Metric
          label="Daily Chg"
          value={`${ticker.change >= 0 ? '+' : ''}${ticker.change.toFixed(2)} (${ticker.changePercent >= 0 ? '+' : ''}${ticker.changePercent.toFixed(2)}%)`}
          color={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}
        />
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-1">
        {(Object.keys(PERIOD_CONFIG) as PricePeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'px-2 py-0.5 text-[9px] rounded transition-colors',
              period === p
                ? 'bg-blue-600 text-white'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            )}
          >
            {PERIOD_CONFIG[p].label}
          </button>
        ))}
      </div>

      {/* Price chart */}
      <div
        className="h-40 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setExpandedChart({ section: 'fundamentals', chartId: 'price' })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: CHART_COLORS.textMuted }}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.border }}
            />
            <YAxis
              tick={{ fontSize: 9, fill: CHART_COLORS.textMuted }}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              width={45}
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
              formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={CHART_COLORS.accent}
              strokeWidth={1.5}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
