'use client';

import { useMemo, useState, useEffect } from 'react';

const MATRIX_ASSETS = ['SPY', 'QQQ', 'TLT', 'GLD', 'VXX', 'UUP', 'BIL', 'SH'];

function hashPair(a: string, b: string): number {
  const key = a < b ? `${a}-${b}` : `${b}-${a}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return hash;
}

function getCorrelation(a: string, b: string, tick: number): number {
  if (a === b) return 1;
  const base = (((hashPair(a, b) % 200) + 200) % 200 - 100) / 100;
  const drift = Math.sin(tick / 4 + hashPair(a, b)) * 0.05;
  return Math.max(-1, Math.min(1, base + drift));
}

function correlationColor(value: number): string {
  if (value >= 0) {
    const r = Math.round(55 + (34 - 55) * value);
    const g = Math.round(65 + (197 - 65) * value);
    const b = Math.round(81 + (94 - 81) * value);
    return `rgb(${r},${g},${b})`;
  } else {
    const t = -value;
    const r = Math.round(55 + (239 - 55) * t);
    const g = Math.round(65 + (68 - 65) * t);
    const b = Math.round(81 + (68 - 81) * t);
    return `rgb(${r},${g},${b})`;
  }
}

export function HedgeMap() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const matrix = useMemo(() => {
    return MATRIX_ASSETS.map((row) =>
      MATRIX_ASSETS.map((col) => getCorrelation(row, col, tick))
    );
  }, [tick]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1 pt-8">Cross-asset correlation matrix</div>
      <div className="flex-1 min-h-0 overflow-auto px-2 pb-1">
        <table className="w-full h-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th className="text-[9px] text-white font-mono p-0" style={{ width: 28 }} />
              {MATRIX_ASSETS.map((asset) => (
                <th
                  key={asset}
                  className="text-[9px] text-white font-mono font-normal p-0 text-center"
                >
                  {asset}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_ASSETS.map((rowAsset, ri) => (
              <tr key={rowAsset}>
                <td className="text-[9px] text-white font-mono p-0 pr-1 text-right">
                  {rowAsset}
                </td>
                {MATRIX_ASSETS.map((colAsset, ci) => {
                  const val = matrix[ri][ci];
                  const isDiag = ri === ci;
                  return (
                    <td
                      key={colAsset}
                      className="p-0 text-center font-mono"
                      style={{
                        backgroundColor: correlationColor(val),
                        transition: 'background-color 0.5s ease',
                        border: isDiag ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div
                        className="text-[9px] leading-tight py-[5px]"
                        style={{
                          color: isDiag ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.75)',
                          fontWeight: isDiag ? 600 : 400,
                        }}
                      >
                        {val.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 px-2 py-1 border-t border-white/[0.08] text-[9px] text-[#999999]">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#FF7243' }} />
          -1
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#374151' }} />
          0
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: '#2EC08B' }} />
          +1
        </span>
      </div>
    </div>
  );
}
