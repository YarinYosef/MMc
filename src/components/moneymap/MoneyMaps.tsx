'use client';

import { useState } from 'react';
import { useOnionStore } from '@/stores/useOnionStore';
import { WidgetContainer } from '@/components/layout/WidgetContainer';
import { type MoneyMapType } from '@/data/types/onion';
import { CrossAssetRotation } from './maps/CrossAssetRotation';
import { SectorRotation } from './maps/SectorRotation';
import { SubSectorRotation } from './maps/SubSectorRotation';
import { FactorStyleRotation } from './maps/FactorStyleRotation';
import { StockSelection } from './maps/StockSelection';
import { InsiderBuybackFlow } from './guidance/InsiderBuybackFlow';
import { NewsPriceReaction } from './guidance/NewsPriceReaction';
import { HedgeMap } from './support/HedgeMap';
import { CalendarOverlay } from './support/CalendarOverlay';
import { SocialSentimentOverlay } from './support/SocialSentimentOverlay';

type LayerType = 'maps' | 'guidance' | 'support';

const LAYER_TABS: { type: LayerType; label: string }[] = [
  { type: 'maps', label: 'Maps' },
  { type: 'guidance', label: 'Guidance' },
  { type: 'support', label: 'Support' },
];

const MAP_TABS: { type: MoneyMapType; label: string }[] = [
  { type: 'cross-asset', label: 'Cross-Asset' },
  { type: 'sector', label: 'Sector' },
  { type: 'sub-sector', label: 'Sub-Sector' },
  { type: 'factor-style', label: 'Factor' },
  { type: 'stock-selection', label: 'Stocks' },
];

type GuidanceType = 'insider' | 'news-price';
const GUIDANCE_TABS: { type: GuidanceType; label: string }[] = [
  { type: 'insider', label: 'Insider Flow' },
  { type: 'news-price', label: 'News/Price' },
];

type SupportType = 'hedge' | 'calendar' | 'sentiment';
const SUPPORT_TABS: { type: SupportType; label: string }[] = [
  { type: 'hedge', label: 'Hedge' },
  { type: 'calendar', label: 'Calendar' },
  { type: 'sentiment', label: 'Sentiment' },
];

export function MoneyMaps() {
  const { activeMoneyMap, setActiveMoneyMap } = useOnionStore();
  const [activeLayer, setActiveLayer] = useState<LayerType>('maps');
  const [activeGuidance, setActiveGuidance] = useState<GuidanceType>('insider');
  const [activeSupport, setActiveSupport] = useState<SupportType>('hedge');

  const renderSubTabs = () => {
    if (activeLayer === 'maps') {
      return MAP_TABS.map((tab) => (
        <button
          key={tab.type}
          onClick={() => setActiveMoneyMap(tab.type)}
          className={`px-1.5 py-0.5 text-[10px] rounded ${
            activeMoneyMap === tab.type
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ));
    }
    if (activeLayer === 'guidance') {
      return GUIDANCE_TABS.map((tab) => (
        <button
          key={tab.type}
          onClick={() => setActiveGuidance(tab.type)}
          className={`px-1.5 py-0.5 text-[10px] rounded ${
            activeGuidance === tab.type
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ));
    }
    return SUPPORT_TABS.map((tab) => (
      <button
        key={tab.type}
        onClick={() => setActiveSupport(tab.type)}
        className={`px-1.5 py-0.5 text-[10px] rounded ${
          activeSupport === tab.type
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {tab.label}
      </button>
    ));
  };

  const renderContent = () => {
    if (activeLayer === 'maps') {
      switch (activeMoneyMap) {
        case 'cross-asset': return <CrossAssetRotation />;
        case 'sector': return <SectorRotation />;
        case 'sub-sector': return <SubSectorRotation />;
        case 'factor-style': return <FactorStyleRotation />;
        case 'stock-selection': return <StockSelection />;
        default: return null;
      }
    }
    if (activeLayer === 'guidance') {
      switch (activeGuidance) {
        case 'insider': return <InsiderBuybackFlow />;
        case 'news-price': return <NewsPriceReaction />;
        default: return null;
      }
    }
    switch (activeSupport) {
      case 'hedge': return <HedgeMap />;
      case 'calendar': return <CalendarOverlay />;
      case 'sentiment': return <SocialSentimentOverlay />;
      default: return null;
    }
  };

  return (
    <WidgetContainer
      id="money-maps"
      title="Money Maps"
      className="h-full"
      noPadding
      headerActions={
        <div className="flex items-center gap-1">
          {LAYER_TABS.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveLayer(tab.type)}
              className={`px-1.5 py-0.5 text-[10px] rounded font-medium ${
                activeLayer === tab.type
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="w-px h-3 bg-slate-700 mx-1" />
          {renderSubTabs()}
        </div>
      }
    >
      <div className="h-full">{renderContent()}</div>
    </WidgetContainer>
  );
}
