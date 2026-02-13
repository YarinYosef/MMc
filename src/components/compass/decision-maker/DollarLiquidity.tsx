'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function stateColor(s: string): string {
  if (s === 'Expanding' || s === 'Bullish') return '#22C55E';
  if (s === 'Contracting' || s === 'Bearish') return '#EF4444';
  return '#F59E0B';
}

function corrColor(val: number): string {
  if (val > 0.3) return '#22C55E';
  if (val > 0) return '#86EFAC';
  if (val > -0.3) return '#FCA5A5';
  return '#EF4444';
}

export function DollarLiquidity({ state, expanded }: Props) {
  const d = state.details;
  const liqState = d.liquidityState as string;
  const bias = d.directionalBias as string;
  const color = stateColor(liqState);
  const biasColor = stateColor(bias);
  const trendAccel = Number(d.trendAcceleration);
  const compression = Number(d.signalCompression);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[10px] font-semibold text-slate-400">$Liq</span>
        <span className="text-[10px] font-bold" style={{ color }}>{liqState}</span>
        <span className="text-[9px] px-1 rounded" style={{ color: biasColor, backgroundColor: `${biasColor}15` }}>
          {bias}
        </span>
        {/* Mini trend arrow */}
        <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
          <path
            d={trendAccel > 0 ? 'M5 8 L5 2 M3 4 L5 2 L7 4' : trendAccel < 0 ? 'M5 2 L5 8 M3 6 L5 8 L7 6' : 'M2 5 L8 5'}
            stroke={trendAccel > 0 ? '#22C55E' : trendAccel < 0 ? '#EF4444' : '#9CA3AF'}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  const corrItems = [
    { label: 'Equity', val: Number(d.corrEquity), abbr: 'EQ' },
    { label: 'Bonds', val: Number(d.corrBonds), abbr: 'BD' },
    { label: 'Gold', val: Number(d.corrGold), abbr: 'AU' },
    { label: 'Crypto', val: Number(d.corrCrypto), abbr: 'CR' },
  ];

  return (
    <div className="p-3 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">Dollar & Global Liquidity</span>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {liqState}
          </span>
          <span
            className="text-[9px] px-1 py-0.5 rounded"
            style={{ color: biasColor, backgroundColor: `${biasColor}10` }}
          >
            {bias}
          </span>
        </div>
      </div>

      {/* Main metrics grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricCard label="Fed Balance Sheet" value={`$${d.fedBalance}T`} sublabel="Total Assets" trend={trendAccel > 0 ? 'up' : trendAccel < 0 ? 'down' : 'flat'} />
        <MetricCard label="DXY Index" value={String(d.dxyIndex)} sublabel="Dollar Strength" trend={Number(d.dxyIndex) > 104 ? 'up' : 'down'} />
        <MetricCard label="RRP Facility" value={`$${d.rrpFacility}B`} sublabel="Reverse Repo" trend={Number(d.rrpFacility) > 500 ? 'up' : 'down'} />
        <MetricCard label="TGA Balance" value={`$${d.tgaBalance}B`} sublabel="Treasury General" trend={Number(d.tgaBalance) > 700 ? 'up' : 'down'} />
      </div>

      {/* Trend & Compression */}
      <div className="bg-slate-800/30 rounded px-2 py-1.5 mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500">Trend Acceleration</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: trendAccel > 0 ? '#22C55E' : trendAccel < 0 ? '#EF4444' : '#9CA3AF' }}>
              {trendAccel > 0 ? '+' : ''}{d.trendAcceleration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500">Compression</span>
            <span className="text-[10px] font-mono text-slate-300">{compression}%</span>
          </div>
        </div>
        {/* Compression bar */}
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${compression}%`,
              backgroundColor: compression > 70 ? '#EF4444' : compression > 40 ? '#F59E0B' : '#22C55E',
            }}
          />
        </div>
      </div>

      {/* USD Cross-Asset Correlation Matrix */}
      <div className="border-t border-slate-700/50 pt-2">
        <div className="text-[9px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">USD Cross-Asset Correlation</div>
        <div className="grid grid-cols-4 gap-1.5">
          {corrItems.map(({ label, val, abbr }) => {
            const c = corrColor(val);
            const barWidth = Math.abs(val) * 100;
            return (
              <div key={label} className="bg-slate-800/40 rounded px-1.5 py-1">
                <div className="text-[8px] text-slate-500 mb-0.5">{abbr}</div>
                <div className="text-[10px] font-mono font-bold mb-0.5" style={{ color: c }}>
                  {val > 0 ? '+' : ''}{val.toFixed(2)}
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: c }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sublabel, trend }: { label: string; value: string; sublabel: string; trend: 'up' | 'down' | 'flat' }) {
  const trendColor = trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : '#9CA3AF';
  return (
    <div className="bg-slate-800/50 rounded px-2 py-1.5">
      <div className="flex items-center justify-between">
        <div className="text-[9px] text-slate-500">{label}</div>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <path
            d={trend === 'up' ? 'M4 7 L4 1 M2 3 L4 1 L6 3' : trend === 'down' ? 'M4 1 L4 7 M2 5 L4 7 L6 5' : 'M1 4 L7 4'}
            stroke={trendColor}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="text-[12px] font-mono font-bold text-slate-200">{value}</div>
      <div className="text-[7px] text-slate-600">{sublabel}</div>
    </div>
  );
}
