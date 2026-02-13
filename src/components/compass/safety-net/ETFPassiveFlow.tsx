'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function flowColor(val: number): string {
  if (val > 500) return '#22C55E';
  if (val > 0) return '#86EFAC';
  if (val > -500) return '#FCA5A5';
  return '#EF4444';
}

export function ETFPassiveFlow({ state, expanded }: Props) {
  const d = state.details;
  const flowStatus = d.flowStatus as string;
  const netFlow = Number(d.netFlow);
  const spyFlow = Number(d.spyFlow);
  const qqqFlow = Number(d.qqqFlow);

  const statusColor = flowStatus === 'Amplifying' ? '#22C55E' : flowStatus === 'Draining' ? '#EF4444' : '#9CA3AF';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[10px] font-semibold text-slate-400">ETF</span>
        <span className="text-[10px] font-bold" style={{ color: statusColor }}>{flowStatus}</span>
        <span className="text-[9px] font-mono" style={{ color: flowColor(netFlow) }}>
          {netFlow > 0 ? '+' : ''}{(netFlow / 1000).toFixed(1)}B
        </span>
      </div>
    );
  }

  const flows = [
    { label: 'Net Flow', value: netFlow, icon: 'NET' },
    { label: 'SPY', value: spyFlow, icon: 'SPY' },
    { label: 'QQQ', value: qqqFlow, icon: 'QQQ' },
  ];

  const maxAbsFlow = Math.max(...flows.map(f => Math.abs(f.value)), 1);

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">ETF Passive Flow</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: statusColor, backgroundColor: `${statusColor}15` }}>
          {flowStatus}
        </span>
      </div>

      {/* Flow breakdown */}
      <div className="space-y-2.5">
        {flows.map(({ label, value, icon }) => {
          const c = flowColor(value);
          const barWidth = (Math.abs(value) / maxAbsFlow) * 50;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 text-[8px] font-bold text-slate-500">{icon}</span>
                  <span className="text-[10px] text-slate-400">{label}</span>
                </div>
                <span className="text-[10px] font-mono font-bold" style={{ color: c }}>
                  ${Math.abs(value).toLocaleString()}M
                </span>
              </div>
              {/* Bidirectional flow bar */}
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="absolute left-1/2 top-0 w-px h-full bg-slate-700" />
                <div
                  className="absolute h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: c,
                    left: value >= 0 ? '50%' : `${50 - barWidth}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow direction summary */}
      <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[9px]">
        <span className="text-slate-500">
          Direction: <span style={{ color: statusColor }}>{netFlow > 0 ? 'Inflow' : 'Outflow'}</span>
        </span>
        <span className="text-slate-500">
          Magnitude: <span className="font-mono text-slate-400">{Math.abs(netFlow / 1000).toFixed(2)}B</span>
        </span>
      </div>
    </div>
  );
}
