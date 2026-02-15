'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useMarketStore } from '@/stores/useMarketStore';
import { ASSET_CLASSES } from '@/data/constants/sectors';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function CrossAssetRotation() {
  const tickers = useMarketStore((s) => s.tickers);

  const data = useMemo(() => {
    return ASSET_CLASSES.map((ac, i) => {
      const t = tickers.get(ac.etf);
      const seedBase = i * 137;
      const flow = Math.round((seededRandom(seedBase + 1) - 0.5) * 100);
      const fallbackMomentum = Math.round((seededRandom(seedBase + 2) - 0.5) * 4 * 100) / 100;
      return {
        name: ac.name,
        etf: ac.etf,
        flow: t ? Math.round(t.changePercent * 10) : flow,
        momentum: t ? t.changePercent : fallbackMomentum,
        color: ac.color,
      };
    });
  }, [tickers]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">Capital flow across asset classes</div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, bottom: 5, left: 60 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#999999' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 9, fill: '#FFFFFF' }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 10 }}
              labelStyle={{ color: '#FFFFFF' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: number, name: string) => [`${value > 0 ? '+' : ''}${value}`, name === 'flow' ? 'Flow Score' : 'Momentum %']) as any}
            />
            <ReferenceLine x={0} stroke="#475569" />
            <Bar dataKey="flow" radius={[0, 4, 4, 0]} barSize={14}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.flow >= 0 ? '#22C55E' : '#EF4444'} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 px-2 py-1 border-t border-white/[0.08]">
        {data.map((d) => (
          <div key={d.etf} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[10px] text-[#999999]">{d.etf}</span>
            <span className={`text-[10px] ${d.momentum >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {d.momentum >= 0 ? '+' : ''}{d.momentum.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
