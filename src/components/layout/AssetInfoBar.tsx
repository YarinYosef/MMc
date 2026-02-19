'use client';

import { useDetailsStore } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';

export function AssetInfoBar() {
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const ticker = useMarketStore((s) => (selectedSymbol ? s.tickers.get(selectedSymbol) : undefined));

  if (!ticker) return null;

  const isPositive = ticker.change >= 0;

  return (
    <div
      className="flex items-center gap-4 px-3 py-1.5 bg-[#131313] border-b border-black shrink-0 min-w-0 overflow-x-auto"
      style={{ boxShadow: 'rgba(255,255,255,0.03) 0px -1px 0px 0px inset' }}
    >
      {/* Symbol + Name */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm font-bold text-white">{ticker.symbol}</span>
        <span className="text-[10px] text-[#777777] max-w-[120px] truncate">{ticker.name}</span>
      </div>

      {/* Price + Change */}
      <div className="flex items-baseline gap-1.5 shrink-0">
        <span className="text-sm font-mono font-semibold text-white">${ticker.price.toFixed(2)}</span>
        <span
          className={cn(
            'text-xs font-mono font-medium',
            isPositive ? 'text-[#2EC08B]' : 'text-[#FF7243]'
          )}
        >
          {isPositive ? '+' : ''}{ticker.change.toFixed(2)} ({formatPercent(ticker.changePercent)})
        </span>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-white/[0.06] shrink-0" />

      {/* Volume */}
      <div className="shrink-0">
        <span className="text-[9px] text-[#555555] uppercase mr-1">Vol</span>
        <span className="text-[10px] font-mono text-[#999999]">{formatCurrency(ticker.volume).replace('$', '')}</span>
      </div>

      {/* Mkt Cap */}
      <div className="shrink-0">
        <span className="text-[9px] text-[#555555] uppercase mr-1">MCap</span>
        <span className="text-[10px] font-mono text-[#999999]">{formatCurrency(ticker.marketCap)}</span>
      </div>

      {/* 52w High */}
      <div className="shrink-0">
        <span className="text-[9px] text-[#555555] uppercase mr-1">52w H</span>
        <span className="text-[10px] font-mono text-[#999999]">${ticker.high52w.toFixed(2)}</span>
      </div>

      {/* 52w Low */}
      <div className="shrink-0">
        <span className="text-[9px] text-[#555555] uppercase mr-1">52w L</span>
        <span className="text-[10px] font-mono text-[#999999]">${ticker.low52w.toFixed(2)}</span>
      </div>

      {/* P/E */}
      <div className="shrink-0">
        <span className="text-[9px] text-[#555555] uppercase mr-1">P/E</span>
        <span className="text-[10px] font-mono text-[#999999]">{ticker.pe.toFixed(1)}</span>
      </div>
    </div>
  );
}
