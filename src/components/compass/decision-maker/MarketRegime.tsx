'use client';

import { type CompassState } from '@/data/types/compass';
import { SIGNAL_COLORS } from '@/data/constants/colors';

const SUB_COMPASS_LABELS: { key: string; label: string; icon: string }[] = [
  { key: 'subLiquidity', label: 'Liquidity', icon: 'L' },
  { key: 'subInterestRates', label: 'Interest Rates', icon: 'R' },
  { key: 'subCreditStress', label: 'Credit Stress', icon: 'C' },
  { key: 'subMacro', label: 'Macro Regime', icon: 'M' },
  { key: 'subCrossAsset', label: 'Cross-Asset', icon: 'X' },
  { key: 'subCorrelation', label: 'Correlation', icon: '%' },
];

function valueColor(v: number): string {
  if (v > 30) return '#2EC08B';
  if (v > 10) return '#86EFAC';
  if (v > -10) return '#9CA3AF';
  if (v > -30) return '#FCA5A5';
  return '#FF7243';
}

function signalLabel(v: number): string {
  if (v > 30) return 'Strong';
  if (v > 10) return 'Bullish';
  if (v > -10) return 'Neutral';
  if (v > -30) return 'Bearish';
  return 'Weak';
}

interface Props {
  state: CompassState;
  expanded: boolean;
}

export function MarketRegime({ state, expanded }: Props) {
  const d = state.details;
  const regime = d.regime as string;
  const trendStrength = Number(d.trendStrength);
  const daysInRegime = Number(d.daysInRegime);
  const regimeColor =
    regime === 'Risk-On' ? '#2EC08B' : regime === 'Risk-Off' ? '#FF7243' : '#F59E0B';

  // Compute aggregate from sub-compasses
  const subValues = SUB_COMPASS_LABELS.filter(s => s.key !== 'subCorrelation').map(s => Number(d[s.key]) || 0);
  const bullishCount = subValues.filter(v => v > 10).length;
  const bearishCount = subValues.filter(v => v < -10).length;

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Regime</span>
        <span className="text-[11px] font-bold" style={{ color: regimeColor }}>
          {regime}
        </span>
        <span className="text-[10px] font-mono text-[#777777]">{trendStrength}%</span>
        {/* Mini sub-compass indicator dots */}
        <div className="flex items-center gap-0.5">
          {SUB_COMPASS_LABELS.filter(s => s.key !== 'subCorrelation').map(({ key }) => {
            const val = Number(d[key]) || 0;
            return (
              <div
                key={key}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: valueColor(val) }}
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
        <span className="text-xs font-semibold text-[#999999]">Market Regime</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ color: regimeColor, backgroundColor: `${regimeColor}15` }}
        >
          {regime}
        </span>
      </div>

      {/* Regime summary bar */}
      <div className="flex items-center gap-3 mb-3 text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-[#777777]">Trend:</span>
          <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${trendStrength}%`,
                backgroundColor: regimeColor,
              }}
            />
          </div>
          <span className="font-mono" style={{ color: regimeColor }}>{trendStrength}%</span>
        </div>
        <span className="text-[#777777]">|</span>
        <span className="text-[#777777]">
          Day <span className="font-mono text-[#999999]">{daysInRegime}</span>
        </span>
        <span className="text-[#777777]">|</span>
        <span className="text-[#2EC08B]/70">{bullishCount}</span>
        <span className="text-[#777777]">/</span>
        <span className="text-[#FF7243]/70">{bearishCount}</span>
      </div>

      {/* Sub-compass bars */}
      <div className="space-y-2">
        {SUB_COMPASS_LABELS.map(({ key, label, icon }) => {
          const val = Number(d[key]) || 0;
          const isCorrelation = key === 'subCorrelation';
          const color = isCorrelation ? (val > 60 ? '#FF7243' : val > 40 ? '#F59E0B' : '#2EC08B') : valueColor(val);
          const displayVal = isCorrelation
            ? `${val.toFixed(0)}%`
            : `${val > 0 ? '+' : ''}${val.toFixed(1)}`;
          const barRatio = isCorrelation ? val / 100 : Math.abs(val) / 100;
          const signal = isCorrelation ? (val > 60 ? 'High' : val > 40 ? 'Normal' : 'Low') : signalLabel(val);

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold bg-white/[0.06] text-[#999999]">
                    {icon}
                  </span>
                  <span className="text-[11px] text-[#999999]">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
                    {signal}
                  </span>
                  <span className="text-[11px] font-mono font-bold" style={{ color }}>
                    {displayVal}
                  </span>
                </div>
              </div>
              {/* Bidirectional bar for non-correlation, standard bar for correlation */}
              {isCorrelation ? (
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barRatio * 100}%`, backgroundColor: color }}
                  />
                </div>
              ) : (
                <div className="relative h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  {/* Center line */}
                  <div className="absolute left-1/2 top-0 w-px h-full bg-white/[0.06]" />
                  {/* Bar from center */}
                  <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barRatio * 50}%`,
                      backgroundColor: color,
                      left: val >= 0 ? '50%' : `${50 - barRatio * 50}%`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Regime history indicator */}
      <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px]">
        <span className="text-[#777777]">
          Confidence: <span className="font-mono text-[#999999]">{state.confidence}%</span>
        </span>
        <span className="text-[#777777]">
          Signal: <span className="font-mono" style={{ color: SIGNAL_COLORS[state.signal] }}>{state.signal}</span>
        </span>
      </div>
    </div>
  );
}
