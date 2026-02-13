'use client';

import { useMemo, useState } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import {
  generateFinancials,
  generateBalanceSheet,
  generateSankeyData,
} from '@/data/generators/financialGenerator';
import { formatCurrency, cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '@/data/constants/colors';
import { SankeyChart } from './SankeyChart';

type TimeframeMode = 'annual' | 'quarterly' | 'ttm';

const TIMEFRAME_OPTIONS: { id: TimeframeMode; label: string }[] = [
  { id: 'annual', label: 'Annual' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'ttm', label: 'TTM' },
];

export function FinancialsSection({ symbol }: { symbol: string }) {
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);
  const [timeframe, setTimeframe] = useState<TimeframeMode>('annual');
  const [years, setYears] = useState(5);

  const financials = useMemo(
    () => generateFinancials(symbol, timeframe, years),
    [symbol, timeframe, years]
  );

  const balanceSheet = useMemo(
    () => generateBalanceSheet(symbol, timeframe, years),
    [symbol, timeframe, years]
  );

  const sankeyData = useMemo(() => {
    const latest = financials[financials.length - 1];
    return latest ? generateSankeyData(latest) : null;
  }, [financials]);

  const revenueData = useMemo(
    () =>
      financials.map((f) => ({
        period: f.period,
        Revenue: f.revenue,
        'Net Income': f.netIncome,
      })),
    [financials]
  );

  const cashDebtData = useMemo(
    () =>
      balanceSheet.map((b) => ({
        period: b.period,
        Cash: b.cash,
        Debt: b.totalDebt,
      })),
    [balanceSheet]
  );

  return (
    <div className="space-y-3">
      {/* Timeframe controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {TIMEFRAME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTimeframe(opt.id)}
              className={cn(
                'px-2 py-0.5 text-[9px] rounded transition-colors',
                timeframe === opt.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {timeframe !== 'ttm' && (
          <div className="flex items-center gap-1">
            {[3, 5, 7, 10].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={cn(
                  'px-1.5 py-0.5 text-[9px] rounded transition-colors',
                  years === y
                    ? 'bg-slate-700 text-slate-200'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {y}Y
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Revenue vs Net Income */}
      <div>
        <div className="text-[10px] text-slate-400 mb-1 font-medium">Revenue vs Net Income</div>
        <div
          className="h-36 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setExpandedChart({ section: 'financials', chartId: 'revenue' })}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 8, fill: CHART_COLORS.textMuted }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.border }}
              />
              <YAxis
                tick={{ fontSize: 8, fill: CHART_COLORS.textMuted }}
                tickFormatter={(v: number) => formatCurrency(v)}
                width={50}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.border }}
              />
              <Tooltip
                contentStyle={{
                  background: CHART_COLORS.surface,
                  border: `1px solid ${CHART_COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: CHART_COLORS.text,
                }}
                formatter={(value: number | undefined) => [formatCurrency(value ?? 0)]}
              />
              <Legend
                wrapperStyle={{ fontSize: '9px' }}
                iconSize={8}
              />
              <Bar dataKey="Revenue" fill={CHART_COLORS.accent} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Net Income" fill={CHART_COLORS.positive} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash vs Debt */}
      <div>
        <div className="text-[10px] text-slate-400 mb-1 font-medium">Cash vs Debt</div>
        <div
          className="h-36 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setExpandedChart({ section: 'financials', chartId: 'cashDebt' })}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashDebtData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 8, fill: CHART_COLORS.textMuted }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.border }}
              />
              <YAxis
                tick={{ fontSize: 8, fill: CHART_COLORS.textMuted }}
                tickFormatter={(v: number) => formatCurrency(v)}
                width={50}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.border }}
              />
              <Tooltip
                contentStyle={{
                  background: CHART_COLORS.surface,
                  border: `1px solid ${CHART_COLORS.border}`,
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: CHART_COLORS.text,
                }}
                formatter={(value: number | undefined) => [formatCurrency(value ?? 0)]}
              />
              <Legend
                wrapperStyle={{ fontSize: '9px' }}
                iconSize={8}
              />
              <Bar dataKey="Cash" fill={CHART_COLORS.positive} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Debt" fill={CHART_COLORS.negative} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sankey Chart */}
      {sankeyData && (
        <div>
          <div className="text-[10px] text-slate-400 mb-1 font-medium">Income Flow (Sankey)</div>
          <div
            className="cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setExpandedChart({ section: 'financials', chartId: 'sankey' })}
          >
            <SankeyChart data={sankeyData} />
          </div>
        </div>
      )}
    </div>
  );
}
