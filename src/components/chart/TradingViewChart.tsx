'use client';

import { useMemo } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';

export function TradingViewChart() {
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const symbol = selectedSymbol || 'AAPL';

  const src = useMemo(() => {
    const config = {
      symbol,
      interval: 'D',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#000000',
      hide_side_toolbar: '0',
      allow_symbol_change: '1',
      withdateranges: '1',
      hide_volume: '0',
      utm_source: '',
      utm_medium: 'widget',
      utm_campaign: 'chart',
    };
    const params = new URLSearchParams(config).toString();
    return `https://s.tradingview.com/widgetembed/?${params}`;
  }, [symbol]);

  return (
    <div
      className="w-full h-full bg-[#131313] border border-black rounded-[var(--radius-widget)] overflow-hidden"
      style={{ boxShadow: 'rgba(255,255,255,0.03) 0px 1px 0px 0px inset, rgba(255,255,255,0.03) -1px 0px 0px 0px inset, rgba(255,255,255,0.03) 1px 0px 0px 0px inset' }}
    >
      <iframe
        src={src}
        className="w-full h-full border-0"
        allowFullScreen
        allow="encrypted-media"
      />
    </div>
  );
}
