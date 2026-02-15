'use client';

import { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { useOnionStore } from '@/stores/useOnionStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { SECTOR_HIERARCHY } from '@/data/constants/sectors';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';

interface TreeNode {
  [key: string]: unknown;
  name: string;
  size?: number;
  color?: string;
  changePercent?: number;
  children?: TreeNode[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TreemapContent(props: any) {
  const { x, y, width, height, name, changePercent } = props;
  if (width < 20 || height < 20) return null;
  const chg = changePercent ?? 0;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={chg >= 0 ? `rgba(34,197,94,${Math.min(Math.abs(chg) * 0.25 + 0.1, 0.7)})` : `rgba(239,68,68,${Math.min(Math.abs(chg) * 0.25 + 0.1, 0.7)})`}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={2}
        rx={3}
        style={{ transition: 'fill 0.5s ease' }}
      />
      {width > 40 && height > 25 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight={600}>
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill={chg >= 0 ? '#86EFAC' : '#FCA5A5'}
            fontSize={8}
          >
            {chg >= 0 ? '+' : ''}{chg.toFixed(1)}%
          </text>
        </>
      )}
    </g>
  );
}

export function SubSectorRotation() {
  const tickers = useMarketStore((s) => s.tickers);
  const drillPath = useOnionStore((s) => s.drillPath);

  const data = useMemo(() => {
    // Use drilled sector or default to Technology
    let sectorName = 'Technology';
    if (drillPath.length >= 1) {
      const etfId = drillPath[0];
      const etfSymbol = etfId.replace('etf-', '');
      const sector = SECTOR_HIERARCHY.find((s) => s.etf === etfSymbol);
      if (sector) sectorName = sector.name;
    }

    const sector = SECTOR_HIERARCHY.find((s) => s.name === sectorName);
    if (!sector) return [];

    const children: TreeNode[] = sector.subSectors.map((sub) => {
      const subTickers = TICKER_UNIVERSE.filter((t) => t.sector === sectorName && t.subSector === sub.name);
      let totalVol = 0;
      let wChange = 0;
      let totalCap = 0;
      for (const def of subTickers) {
        const t = tickers.get(def.symbol);
        if (t) {
          totalVol += t.volume;
          wChange += t.changePercent * t.marketCap;
          totalCap += t.marketCap;
        }
      }
      const chg = totalCap > 0 ? wChange / totalCap : 0;
      return {
        name: sub.name,
        size: Math.max(totalVol / 1_000_000, 5),
        color: chg >= 0 ? `rgba(34,197,94,${Math.min(Math.abs(chg) * 0.3, 0.8)})` : `rgba(239,68,68,${Math.min(Math.abs(chg) * 0.3, 0.8)})`,
        changePercent: chg,
      };
    });

    return [{ name: sectorName, children }];
  }, [tickers, drillPath]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">Sub-sector heatmap by volume</div>
      <div className="flex-1 min-h-0">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data}
              dataKey="size"
              aspectRatio={4 / 3}
              content={<TreemapContent />}
              isAnimationActive={false}
            >
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 10 }}
              />
            </Treemap>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-[#999999] text-xs">
            No sub-sector data
          </div>
        )}
      </div>
    </div>
  );
}
