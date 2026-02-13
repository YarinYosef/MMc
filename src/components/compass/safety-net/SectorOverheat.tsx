'use client';

import { type CompassState } from '@/data/types/compass';
import { useOnionStore } from '@/stores/useOnionStore';

interface Props {
  state: CompassState;
  expanded: boolean;
}

const SECTORS = ['XLK', 'XLF', 'XLE', 'XLV', 'XLI'];
const SECTOR_NAMES: Record<string, string> = {
  XLK: 'Technology',
  XLF: 'Financials',
  XLE: 'Energy',
  XLV: 'Healthcare',
  XLI: 'Industrials',
};

function heatColor(temp: number): string {
  if (temp > 80) return '#EF4444';
  if (temp > 60) return '#F97316';
  if (temp > 40) return '#F59E0B';
  return '#22C55E';
}

export function SectorOverheat({ state, expanded }: Props) {
  const d = state.details;
  const avgStatus = d.avgStatus as string;
  const avgTemp = Number(d.avgTemp);
  const selectedSegment = useOnionStore((s) => s.selectedSegment);

  const color = avgStatus === 'Extended' ? '#EF4444' : '#22C55E';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[10px] font-semibold text-slate-400">Heat</span>
        <span className="text-[10px] font-bold" style={{ color }}>{avgStatus}</span>
        <span className="text-[9px] font-mono text-slate-500">{avgTemp}</span>
        {/* Mini sector heat dots */}
        <div className="flex items-center gap-0.5">
          {SECTORS.map((sector) => {
            const temp = Number(d[`${sector}_temp`]) || 0;
            return (
              <div
                key={sector}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: heatColor(temp) }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-300">Sector Overheat</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold" style={{ color }}>
            Avg {avgTemp}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
            {avgStatus}
          </span>
        </div>
      </div>

      {selectedSegment && (
        <div className="mb-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] text-blue-400">
          Context: <span className="font-semibold">{selectedSegment}</span>
        </div>
      )}

      {/* Sector heat cards */}
      <div className="space-y-2">
        {SECTORS.map((sector) => {
          const temp = Number(d[`${sector}_temp`]) || 0;
          const participation = Number(d[`${sector}_participation`]) || 0;
          const volatility = d[`${sector}_volatility`];
          const speed = Number(d[`${sector}_speed`]) || 0;
          const status = d[`${sector}_status`] as string;
          const sColor = heatColor(temp);

          return (
            <div key={sector} className="bg-slate-800/30 rounded px-2.5 py-2">
              {/* Sector header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-200">{sector}</span>
                  <span className="text-[8px] text-slate-500">{SECTOR_NAMES[sector]}</span>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: sColor, backgroundColor: `${sColor}15` }}>
                  {status}
                </span>
              </div>

              {/* Heat bar */}
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${temp}%`,
                    background: temp > 70
                      ? 'linear-gradient(to right, #F59E0B, #EF4444)'
                      : temp > 40
                      ? 'linear-gradient(to right, #22C55E, #F59E0B)'
                      : '#22C55E',
                  }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-4 gap-1.5 text-[8px]">
                <div>
                  <span className="text-slate-600">Temp</span>
                  <div className="font-mono font-bold" style={{ color: sColor }}>{temp}</div>
                </div>
                <div>
                  <span className="text-slate-600">Part</span>
                  <div className="font-mono text-slate-400">{participation}%</div>
                </div>
                <div>
                  <span className="text-slate-600">Vol</span>
                  <div className="font-mono text-slate-400">{volatility}</div>
                </div>
                <div>
                  <span className="text-slate-600">Speed</span>
                  <div className="font-mono text-slate-400">{speed}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
