'use client';

import { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { FACTOR_STYLES } from '@/data/constants/sectors';
import { useMarketStore } from '@/stores/useMarketStore';

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function FactorStyleRotation() {
  const tickers = useMarketStore((s) => s.tickers);

  const data = useMemo(() => {
    return FACTOR_STYLES.map((f) => {
      const t = tickers.get(f.etf);
      return {
        factor: f.name,
        current: Math.round(50 + gaussianRandom() * 25),
        previous: Math.round(50 + gaussianRandom() * 25),
        momentum: t ? t.changePercent : Math.round(gaussianRandom() * 2 * 100) / 100,
      };
    });
  }, [tickers]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-slate-400 px-2 pb-1">Factor/style strength radar</div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="factor"
              tick={{ fontSize: 8, fill: '#94A3B8' }}
            />
            <PolarRadiusAxis
              tick={{ fontSize: 7, fill: '#475569' }}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 6, fontSize: 10 }}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.1}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 px-2 py-1 border-t border-slate-700/50">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-blue-500" />
          <span className="text-[9px] text-slate-400">Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-indigo-500 border-dashed" />
          <span className="text-[9px] text-slate-400">Previous</span>
        </div>
      </div>
    </div>
  );
}
