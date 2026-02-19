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
  if (temp > 80) return '#FF7243';
  if (temp > 60) return '#F97316';
  if (temp > 40) return '#F59E0B';
  return '#2EC08B';
}

export function SectorOverheat({ state, expanded }: Props) {
  const d = state.details;
  const avgStatus = d.avgStatus as string;
  const avgTemp = Number(d.avgTemp);
  const selectedSegment = useOnionStore((s) => s.selectedSegment);

  const color = avgStatus === 'Extended' ? '#FF7243' : '#2EC08B';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Heat</span>
        <span className="text-[11px] font-bold" style={{ color }}>{avgStatus}</span>
        <span className="text-[10px] font-mono text-[#777777]">{avgTemp}</span>
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
        <span className="text-xs font-semibold text-[#999999]">Sector Overheat</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold" style={{ color }}>
            Avg {avgTemp}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
            {avgStatus}
          </span>
        </div>
      </div>

      {selectedSegment && (
        <div className="mb-2 px-2 py-1 bg-[#AB9FF2]/10 border border-[#AB9FF2]/20 rounded text-[10px] text-[#AB9FF2]">
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
            <div key={sector} className="bg-white/[0.03] rounded px-2.5 py-2">
              {/* Sector header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white">{sector}</span>
                  <span className="text-[9px] text-[#777777]">{SECTOR_NAMES[sector]}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: sColor, backgroundColor: `${sColor}15` }}>
                  {status}
                </span>
              </div>

              {/* Heat bar */}
              <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${temp}%`,
                    background: temp > 70
                      ? 'linear-gradient(to right, #F59E0B, #FF7243)'
                      : temp > 40
                      ? 'linear-gradient(to right, #2EC08B, #F59E0B)'
                      : '#2EC08B',
                  }}
                />
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-4 gap-1.5 text-[9px]">
                <div>
                  <span className="text-[#777777]">Temp</span>
                  <div className="font-mono font-bold" style={{ color: sColor }}>{temp}</div>
                </div>
                <div>
                  <span className="text-[#777777]">Part</span>
                  <div className="font-mono text-[#999999]">{participation}%</div>
                </div>
                <div>
                  <span className="text-[#777777]">Vol</span>
                  <div className="font-mono text-[#999999]">{volatility}</div>
                </div>
                <div>
                  <span className="text-[#777777]">Speed</span>
                  <div className="font-mono text-[#999999]">{speed}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
