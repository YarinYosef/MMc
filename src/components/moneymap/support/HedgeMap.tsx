'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const HEDGE_CANDIDATES = [
  { symbol: 'TLT', name: 'Long-Term Treasuries', type: 'bonds' },
  { symbol: 'GLD', name: 'Gold', type: 'commodity' },
  { symbol: 'VXX', name: 'VIX Short-Term', type: 'volatility' },
  { symbol: 'SH', name: 'Short S&P 500', type: 'inverse' },
  { symbol: 'UUP', name: 'US Dollar Bull', type: 'forex' },
  { symbol: 'BIL', name: 'T-Bills (Cash)', type: 'cash' },
];

export function HedgeMap() {
  const data = useMemo(() => {
    return HEDGE_CANDIDATES.map((h) => {
      const correlation = Math.round(gaussianRandom() * 40) / 100; // -1 to 1
      const effectiveness = Math.round(50 + gaussianRandom() * 30);
      return {
        name: h.symbol,
        fullName: h.name,
        type: h.type,
        correlation,
        effectiveness,
        regime: effectiveness > 60 ? 'Strong' : effectiveness > 40 ? 'Moderate' : 'Weak',
      };
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-slate-400 px-2 pb-1">Defense candidates for current regime</div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, bottom: 5, left: 35 }}>
            <XAxis
              type="number"
              tick={{ fontSize: 8, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 9, fill: '#E2E8F0' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 6, fontSize: 10 }}
              formatter={((value: number, _name: string, props: { payload?: { regime?: string; fullName?: string } }) => {
                const item = props?.payload;
                return [
                  `${value} (${item?.regime ?? ''})`,
                  `${item?.fullName ?? ''} - Effectiveness`,
                ];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any}
            />
            <Bar dataKey="effectiveness" radius={[0, 4, 4, 0]} barSize={12}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.effectiveness > 60
                      ? '#22C55E'
                      : entry.effectiveness > 40
                      ? '#F59E0B'
                      : '#EF4444'
                  }
                  opacity={0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-3 px-2 py-1 border-t border-slate-700/50 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-green-500" />
          <span className="text-slate-400">Strong</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-slate-400">Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-slate-400">Weak</span>
        </div>
      </div>
    </div>
  );
}
