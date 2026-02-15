'use client';

import { useMemo } from 'react';
import { useMarketStore } from '@/stores/useMarketStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';
import { formatPercent } from '@/lib/utils';
import { formatVolume } from '@/data/generators/tickerGenerator';

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

interface RankedTicker {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  score: number;
}

export function StockSelection() {
  const tickers = useMarketStore((s) => s.tickers);
  const setSelectedSymbol = useDetailsStore((s) => s.setSelectedSymbol);

  const ranked = useMemo(() => {
    const candidates: RankedTicker[] = [];

    for (const def of TICKER_UNIVERSE) {
      const t = tickers.get(def.symbol);
      if (!t) continue;

      // Composite score: momentum + volume surge + mean reversion
      const momentumScore = t.changePercent * 10;
      const volumeScore = t.volume > t.avgVolume ? (t.volume / t.avgVolume - 1) * 20 : 0;
      const valueScore = t.pe < 20 ? (20 - t.pe) * 0.5 : 0;
      const score = Math.round((momentumScore + volumeScore + valueScore + gaussianRandom() * 5) * 10) / 10;

      candidates.push({
        symbol: def.symbol,
        name: def.name,
        sector: def.sector,
        price: t.price,
        changePercent: t.changePercent,
        volume: t.volume,
        marketCap: t.marketCap,
        score,
      });
    }

    return candidates.sort((a, b) => b.score - a.score).slice(0, 12);
  }, [tickers]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">Top ranked candidates by composite score</div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-[10px]">
          <thead className="sticky top-0 bg-[#131313]/90">
            <tr className="text-[#999999] border-b border-black">
              <th className="text-left py-1 px-1.5 font-medium">#</th>
              <th className="text-left py-1 px-1.5 font-medium">Ticker</th>
              <th className="text-right py-1 px-1.5 font-medium">Price</th>
              <th className="text-right py-1 px-1.5 font-medium">Chg%</th>
              <th className="text-right py-1 px-1.5 font-medium">Vol</th>
              <th className="text-right py-1 px-1.5 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => (
              <tr
                key={r.symbol}
                className="border-b border-white/[0.05] hover:bg-white/[0.03] cursor-pointer"
                onClick={() => setSelectedSymbol(r.symbol)}
              >
                <td className="py-1 px-1.5 text-[#999999]">{i + 1}</td>
                <td className="py-1 px-1.5">
                  <div className="text-white font-semibold">{r.symbol}</div>
                  <div className="text-[#999999] text-[10px]">{r.sector}</div>
                </td>
                <td className="py-1 px-1.5 text-right text-white">${r.price.toFixed(2)}</td>
                <td className={`py-1 px-1.5 text-right ${r.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercent(r.changePercent)}
                </td>
                <td className="py-1 px-1.5 text-right text-[#999999]">{formatVolume(r.volume)}</td>
                <td className="py-1 px-1.5 text-right">
                  <span className={`font-bold ${r.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {r.score > 0 ? '+' : ''}{r.score.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
