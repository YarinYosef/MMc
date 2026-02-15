'use client';

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import { generateSectorRotationData } from '@/data/generators/sectorGenerator';


export function SectorRotation() {
  const data = useMemo(() => {
    return generateSectorRotationData().map((s) => ({
      ...s,
      z: Math.abs(s.flowScore) + 10,
    }));
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">
        Sector rotation: Momentum vs Relative Strength
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <XAxis
              type="number"
              dataKey="momentum"
              name="Momentum"
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              label={{ value: 'Momentum', position: 'bottom', fontSize: 10, fill: '#999999' }}
            />
            <YAxis
              type="number"
              dataKey="relativeStrength"
              name="RS"
              tick={{ fontSize: 10, fill: '#999999' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              label={{ value: 'RS', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#999999' }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 200]} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 10 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((value: number, name: string) => [value.toFixed(1), name]) as any}
              labelFormatter={(_, payload) => {
                if (payload && payload.length > 0) {
                  const p = payload[0].payload;
                  return `${p.name} (Flow: ${p.flowScore > 0 ? '+' : ''}${p.flowScore})`;
                }
                return '';
              }}
            />
            <Scatter data={data}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} opacity={0.85} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 px-2 py-1 border-t border-white/[0.08]">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[10px] text-[#999999]">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
