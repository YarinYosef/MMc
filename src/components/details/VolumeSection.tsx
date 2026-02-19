'use client';

import { useMemo } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { generateVolumeData } from '@/data/generators/financialGenerator';
import { formatCurrency, cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CHART_COLORS } from '@/data/constants/colors';

export function VolumeSection({ symbol, expanded }: { symbol: string; expanded?: boolean }) {
  const ticker = useMarketStore((s) => s.tickers.get(symbol));
  const setExpandedChart = useDetailsStore((s) => s.setExpandedChart);

  const volume = ticker?.volume;
  const avgVolume = ticker?.avgVolume;
  const volumeData = useMemo(() => {
    if (volume == null || avgVolume == null) return null;
    return generateVolumeData(symbol, volume, avgVolume);
  }, [symbol, volume, avgVolume]);

  if (!ticker || !volumeData) return null;

  const chartData = [
    { name: 'Pre-Market', volume: volumeData.preMarketVolume, fill: '#F59E0B' },
    { name: 'Regular', volume: volumeData.regularVolume, fill: CHART_COLORS.accent },
  ];

  const totalVolume = volumeData.preMarketVolume + volumeData.regularVolume;
  const volVsAvg = ((totalVolume / volumeData.avgVolume30d) * 100 - 100);

  return (
    <div className="space-y-2">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-[10px] text-[#999999]">Pre-Market</div>
          <div className="text-[11px] font-mono text-[#CD8554]">
            {formatCurrency(volumeData.preMarketVolume).replace('$', '')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#999999]">Regular</div>
          <div className="text-[11px] font-mono text-[#AB9FF2]">
            {formatCurrency(volumeData.regularVolume).replace('$', '')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[#999999]">30d Avg</div>
          <div className="text-[11px] font-mono text-[#999999]">
            {formatCurrency(volumeData.avgVolume30d).replace('$', '')}
          </div>
        </div>
      </div>

      {/* vs Average */}
      <div className="text-center">
        <span className={`text-[10px] font-mono ${volVsAvg >= 0 ? 'text-[#2EC08B]' : 'text-[#FF7243]'}`}>
          {volVsAvg >= 0 ? '+' : ''}{volVsAvg.toFixed(1)}% vs 30d avg
        </span>
      </div>

      {/* Volume chart */}
      <div
        className={cn(
          expanded ? 'h-[60vh]' : 'h-36',
          'overflow-hidden',
          !expanded && 'cursor-pointer hover:opacity-90 transition-opacity'
        )}
        onClick={expanded ? undefined : () => setExpandedChart({ section: 'volume', chartId: 'volume' })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 15, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: CHART_COLORS.textMuted }}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.border }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: CHART_COLORS.textMuted }}
              tickFormatter={(v: number) => formatCurrency(v).replace('$', '')}
              width={45}
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
              formatter={(value: number | undefined) => [formatCurrency(value ?? 0).replace('$', ''), 'Volume']}
            />
            <ReferenceLine
              y={volumeData.avgVolume30d}
              stroke={CHART_COLORS.textMuted}
              strokeDasharray="5 3"
              label={{
                value: '30d Avg',
                position: 'right',
                fill: CHART_COLORS.textMuted,
                fontSize: 10,
              }}
            />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <rect key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
