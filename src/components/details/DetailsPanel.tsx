'use client';

import { useCallback, useId, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { useDetailsStore, type DetailsSection } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { ChartModal } from '@/components/shared/ChartModal';
import { cn, formatPercent } from '@/lib/utils';
import { FundamentalsSection } from './FundamentalsSection';
import { FinancialsSection } from './FinancialsSection';
import { VolumeSection } from './VolumeSection';
import { OptionsSection } from './OptionsSection';
import { OrderBookSection } from './OrderBookSection';
import { InsiderSection } from './InsiderSection';

const SECTION_LABELS: Record<DetailsSection, string> = {
  fundamentals: 'Fundamentals',
  financials: 'Financials',
  volume: 'Volume',
  options: 'Options',
  orderbook: 'Order Book',
  insider: 'Insider',
};

interface SortableSectionProps {
  id: DetailsSection;
  symbol: string;
  minimized: boolean;
  onToggle: () => void;
}

function SortableSection({ id, symbol, minimized, onToggle }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContent = useCallback(() => {
    switch (id) {
      case 'fundamentals':
        return <FundamentalsSection symbol={symbol} />;
      case 'financials':
        return <FinancialsSection symbol={symbol} />;
      case 'volume':
        return <VolumeSection symbol={symbol} />;
      case 'options':
        return <OptionsSection symbol={symbol} />;
      case 'orderbook':
        return <OrderBookSection symbol={symbol} />;
      case 'insider':
        return <InsiderSection symbol={symbol} />;
      default:
        return null;
    }
  }, [id, symbol]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-slate-800/40 rounded border border-slate-800 mb-2',
        isDragging && 'opacity-50 z-50'
      )}
    >
      {/* Section header - draggable */}
      <div
        className="flex items-center justify-between px-2 py-1.5 cursor-grab active:cursor-grabbing select-none"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-slate-600">
            <circle cx="2" cy="2" r="1" />
            <circle cx="6" cy="2" r="1" />
            <circle cx="2" cy="6" r="1" />
            <circle cx="6" cy="6" r="1" />
          </svg>
          <span className="text-[10px] font-medium text-slate-300">
            {SECTION_LABELS[id]}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={cn('transition-transform duration-200', minimized && '-rotate-90')}
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Section content */}
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandedChartContent({ section, symbol }: { section: DetailsSection; symbol: string }) {
  switch (section) {
    case 'fundamentals':
      return <FundamentalsSection symbol={symbol} />;
    case 'financials':
      return <FinancialsSection symbol={symbol} />;
    case 'volume':
      return <VolumeSection symbol={symbol} />;
    case 'options':
      return <OptionsSection symbol={symbol} />;
    case 'orderbook':
      return <OrderBookSection symbol={symbol} />;
    case 'insider':
      return <InsiderSection symbol={symbol} />;
    default:
      return null;
  }
}

export function DetailsPanel() {
  const dndId = useId();
  const {
    selectedSymbol,
    sectionOrder,
    sectionStates,
    expandedChart,
    toggleSection,
    setSectionOrder,
    setExpandedChart,
  } = useDetailsStore();

  const ticker = useMarketStore((s) => (selectedSymbol ? s.tickers.get(selectedSymbol) : undefined));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sectionOrder.indexOf(active.id as DetailsSection);
      const newIndex = sectionOrder.indexOf(over.id as DetailsSection);
      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = [...sectionOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, active.id as DetailsSection);
      setSectionOrder(newOrder);
    },
    [sectionOrder, setSectionOrder]
  );

  const modalTitle = useMemo(() => {
    if (!expandedChart) return '';
    return `${SECTION_LABELS[expandedChart.section]} - ${selectedSymbol || ''}`;
  }, [expandedChart, selectedSymbol]);

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Ticker header */}
      <div className="px-3 py-2 border-b border-slate-800 shrink-0">
        {ticker ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-100">{ticker.symbol}</span>
              <span className="text-lg font-mono text-slate-100">${ticker.price.toFixed(2)}</span>
            </div>
            <div
              className={cn(
                'text-xs font-mono',
                ticker.change >= 0 ? 'text-green-400' : 'text-red-400'
              )}
            >
              {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({formatPercent(ticker.changePercent)})
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{ticker.name}</div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">Select a ticker</div>
        )}
      </div>

      {/* Scrollable sections - all stacked vertically */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {selectedSymbol ? (
            <DndContext
              id={dndId}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                {sectionOrder.map((sectionId) => (
                  <SortableSection
                    key={sectionId}
                    id={sectionId}
                    symbol={selectedSymbol}
                    minimized={sectionStates[sectionId].minimized}
                    onToggle={() => toggleSection(sectionId)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-xs text-slate-500 text-center py-8">
              Select a ticker to view details
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chart enlargement modal */}
      <ChartModal
        open={!!expandedChart}
        onOpenChange={(open) => {
          if (!open) setExpandedChart(null);
        }}
        title={modalTitle}
      >
        {expandedChart && selectedSymbol && (
          <div className="h-full overflow-auto p-4">
            <ExpandedChartContent
              section={expandedChart.section}
              symbol={selectedSymbol}
            />
          </div>
        )}
      </ChartModal>
    </div>
  );
}
