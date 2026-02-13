'use client';

import { type Ticker } from '@/data/types/market';
import { formatPercent, formatCurrency } from '@/lib/utils';
import { formatVolume } from '@/data/generators/tickerGenerator';

interface OnionTooltipProps {
  x: number;
  y: number;
  label: string;
  value: number;
  change: number;
  changePercent: number;
  extra?: Ticker | null;
  visible: boolean;
}

export function OnionTooltip({ x, y, label, value, changePercent, extra, visible }: OnionTooltipProps) {
  if (!visible) return null;

  const isPositive = changePercent >= 0;

  return (
    <div
      className="fixed z-50 pointer-events-none bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl"
      style={{
        left: x + 12,
        top: y - 10,
        minWidth: 180,
      }}
    >
      <div className="text-xs font-bold text-slate-100 mb-1">{label}</div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-slate-400">Allocation:</span>
        <span className="text-[10px] text-slate-200">{value.toFixed(1)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400">Change:</span>
        <span className={`text-[10px] font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {formatPercent(changePercent)}
        </span>
      </div>
      {extra && (
        <>
          <div className="border-t border-slate-700 mt-1.5 pt-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Price:</span>
              <span className="text-[10px] text-slate-200">${extra.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Daily:</span>
              <span className={`text-[10px] ${extra.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(extra.changePercent)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Market Cap:</span>
              <span className="text-[10px] text-slate-200">{formatCurrency(extra.marketCap)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Volume:</span>
              <span className="text-[10px] text-slate-200">{formatVolume(extra.volume)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">P/E:</span>
              <span className="text-[10px] text-slate-200">{extra.pe.toFixed(1)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
