'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

const ANOMALY_SEVERITY: Record<string, { color: string; level: string }> = {
  'Volume Divergence': { color: '#F59E0B', level: 'Medium' },
  'Price Gap': { color: '#EF4444', level: 'High' },
  'RSI Divergence': { color: '#F97316', level: 'Medium' },
  'MACD Cross': { color: '#F59E0B', level: 'Medium' },
  'Bollinger Break': { color: '#EF4444', level: 'High' },
};

export function TechnicalAnomalies({ state, expanded }: Props) {
  const d = state.details;
  const isNormal = d.isNormal === 'Normal';
  const anomalyCount = Number(d.anomalyCount);
  const detected = d.detected as string;

  const color = isNormal ? '#22C55E' : '#EF4444';

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Anomaly</span>
        {isNormal ? (
          <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
            <path d="M2 5 L4 7 L8 3" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
              <path d="M5 1 L9 9 L1 9 Z" fill="none" stroke="#EF4444" strokeWidth="1.2" strokeLinejoin="round" />
              <line x1="5" y1="4" x2="5" y2="6" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="5" cy="7.5" r="0.5" fill="#EF4444" />
            </svg>
            <span className="text-[10px] font-mono text-red-400">{anomalyCount}</span>
          </>
        )}
      </div>
    );
  }

  const anomalyList = detected !== 'None' ? detected.split(', ') : [];

  return (
    <div className="p-3 w-60">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Technical Anomalies</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {isNormal ? 'Clear' : `${anomalyCount} Alert${anomalyCount > 1 ? 's' : ''}`}
        </span>
      </div>

      {isNormal ? (
        <div className="bg-white/[0.03] rounded p-3 text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" className="mx-auto mb-1">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#22C55E" strokeWidth="1.5" />
            <path d="M7 12 L10 15 L17 8" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-[11px] text-green-400 font-semibold">All Clear</div>
          <div className="text-[10px] text-[#777777] mt-0.5">No anomalies detected</div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {anomalyList.map((anomaly) => {
            const severity = ANOMALY_SEVERITY[anomaly] || { color: '#F59E0B', level: 'Medium' };
            return (
              <div
                key={anomaly}
                className="flex items-center gap-2 bg-white/[0.03] rounded px-2 py-1.5"
              >
                {/* Warning icon */}
                <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
                  <path d="M6 1 L11 10 L1 10 Z" fill="none" stroke={severity.color} strokeWidth="1" strokeLinejoin="round" />
                  <line x1="6" y1="5" x2="6" y2="7" stroke={severity.color} strokeWidth="1" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.4" fill={severity.color} />
                </svg>
                <div className="flex-1">
                  <div className="text-[11px] text-[#999999]">{anomaly}</div>
                </div>
                <span
                  className="text-[9px] font-bold px-1 py-0.5 rounded"
                  style={{ color: severity.color, backgroundColor: `${severity.color}15` }}
                >
                  {severity.level}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Status footer */}
      <div className="mt-2 pt-2 border-t border-white/[0.08] text-[10px] text-[#777777] flex justify-between">
        <span>Confidence: <span className="font-mono text-[#999999]">{state.confidence}%</span></span>
        <span>Signal: <span className="font-mono" style={{ color }}>{state.signal}</span></span>
      </div>
    </div>
  );
}
