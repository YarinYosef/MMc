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
      className="fixed z-50 pointer-events-none bg-white/[0.06] border border-black rounded-lg px-3 py-2 shadow-xl"
      style={{
        left: x + 12,
        top: y - 10,
        minWidth: 180,
      }}
    >
      <div className="text-xs font-bold text-white mb-1">{label}</div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-[#999999]">Allocation:</span>
        <span className="text-[10px] text-white">{value.toFixed(1)}%</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#999999]">Change:</span>
        <span className={`text-[10px] font-medium ${isPositive ? 'text-[#2EC08B]' : 'text-[#FF7243]'}`}>
          {formatPercent(changePercent)}
        </span>
      </div>
      {extra && (
        <>
          <div className="border-t border-black mt-1.5 pt-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#999999]">Price:</span>
              <span className="text-[10px] text-white">${extra.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#999999]">Daily:</span>
              <span className={`text-[10px] ${extra.change >= 0 ? 'text-[#2EC08B]' : 'text-[#FF7243]'}`}>
                {formatPercent(extra.changePercent)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#999999]">Market Cap:</span>
              <span className="text-[10px] text-white">{formatCurrency(extra.marketCap)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#999999]">Volume:</span>
              <span className="text-[10px] text-white">{formatVolume(extra.volume)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#999999]">P/E:</span>
              <span className="text-[10px] text-white">{extra.pe.toFixed(1)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
