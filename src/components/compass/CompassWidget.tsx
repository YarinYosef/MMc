'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { type CompassConfig, type CompassState } from '@/data/types/compass';
import { SIGNAL_COLORS } from '@/data/constants/colors';
import { useCompassStore } from '@/stores/useCompassStore';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { Skeleton } from '@/components/shared/Skeleton';
import { Portal } from '@/components/shared/Portal';

const compassComponents: Record<string, React.LazyExoticComponent<React.ComponentType<{ state: CompassState; expanded: boolean }>>> = {
  'market-regime': lazy(() => import('./decision-maker/MarketRegime').then(m => ({ default: m.MarketRegime }))),
  'dollar-liquidity': lazy(() => import('./decision-maker/DollarLiquidity').then(m => ({ default: m.DollarLiquidity }))),
  'microsoft-proxy': lazy(() => import('./decision-maker/MicrosoftProxy').then(m => ({ default: m.MicrosoftProxy }))),
  'vix': lazy(() => import('./decision-maker/VIXCompass').then(m => ({ default: m.VIXCompass }))),
  'volume': lazy(() => import('./decision-maker/VolumeCompass').then(m => ({ default: m.VolumeCompass }))),
  'social-sentiment': lazy(() => import('./safety-net/SocialSentiment').then(m => ({ default: m.SocialSentiment }))),
  'fear-greed': lazy(() => import('./safety-net/FearGreed').then(m => ({ default: m.FearGreed }))),
  'structure-sr': lazy(() => import('./safety-net/StructureSR').then(m => ({ default: m.StructureSR }))),
  'gamma': lazy(() => import('./safety-net/GammaCompass').then(m => ({ default: m.GammaCompass }))),
  'short-interest': lazy(() => import('./safety-net/ShortInterest').then(m => ({ default: m.ShortInterest }))),
  'breadth-participation': lazy(() => import('./safety-net/BreadthParticipation').then(m => ({ default: m.BreadthParticipation }))),
  'trend-quality': lazy(() => import('./safety-net/TrendQuality').then(m => ({ default: m.TrendQuality }))),
  'etf-passive-flow': lazy(() => import('./safety-net/ETFPassiveFlow').then(m => ({ default: m.ETFPassiveFlow }))),
  'futures-positioning': lazy(() => import('./safety-net/FuturesPositioning').then(m => ({ default: m.FuturesPositioning }))),
  'sector-overheat': lazy(() => import('./safety-net/SectorOverheat').then(m => ({ default: m.SectorOverheat }))),
  'analysts': lazy(() => import('./support/AnalystsCompass').then(m => ({ default: m.AnalystsCompass }))),
  'time': lazy(() => import('./support/TimeCompass').then(m => ({ default: m.TimeCompass }))),
  'technical-anomalies': lazy(() => import('./support/TechnicalAnomalies').then(m => ({ default: m.TechnicalAnomalies }))),
};

interface CompassWidgetProps {
  config: CompassConfig;
  state: CompassState | null;
}

const LAYER_COLORS: Record<string, { border: string; accent: string }> = {
  'decision-maker': { border: 'border-amber-500/20', accent: '#F59E0B' },
  'safety-net': { border: 'border-cyan-500/20', accent: '#06B6D4' },
  'support': { border: 'border-purple-500/20', accent: '#A855F7' },
};

export function CompassWidget({ config, state }: CompassWidgetProps) {
  const expanded = useCompassStore((s) => s.barState.expanded);
  const setExpanded = useCompassStore((s) => s.setExpanded);
  const isExpanded = expanded === config.id;
  const expandedRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: config.id });

  // Combine sortable ref with our widget ref
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      (widgetRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [setNodeRef]
  );

  // Update panel position when expanded
  useEffect(() => {
    if (isExpanded && widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setPanelPos({ top: rect.bottom, left: rect.left });
    } else {
      setPanelPos(null);
    }
  }, [isExpanded]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isExpanded ? 40 : 'auto',
  };

  const signalColor = state ? SIGNAL_COLORS[state.signal] : '#6B7280';
  const layerStyle = LAYER_COLORS[config.layer] || LAYER_COLORS['support'];
  const CompassContent = compassComponents[config.id];

  const handleClick = useCallback(() => {
    setExpanded(isExpanded ? null : config.id);
  }, [isExpanded, config.id, setExpanded]);

  const closedContent = state && CompassContent ? (
    <Suspense fallback={<Skeleton className="h-3 w-12" />}>
      <CompassContent state={state} expanded={false} />
    </Suspense>
  ) : (
    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
      {config.shortName}
    </span>
  );

  return (
    <div
      ref={combinedRef}
      style={style as React.CSSProperties}
      data-compass-widget={config.id}
      className={cn(
        'relative flex flex-col border-r transition-all duration-200',
        isDragging && 'opacity-40 scale-95',
        isExpanded ? 'z-40 bg-slate-800/50' : '',
        layerStyle.border
      )}
    >
      {/* Layer indicator line at top */}
      <div
        className="h-[2px] w-full opacity-40"
        style={{ backgroundColor: layerStyle.accent }}
      />

      {/* Closed header - always visible */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-1.5 cursor-pointer select-none min-w-0 shrink-0',
              'hover:bg-slate-800/60 transition-colors',
              isExpanded && 'bg-slate-800/80'
            )}
            onClick={handleClick}
            {...attributes}
            {...listeners}
          >
            {/* Signal dot with pulse animation for strong signals */}
            <div className="relative shrink-0">
              <div
                className="w-2 h-2 rounded-full transition-colors duration-500"
                style={{ backgroundColor: signalColor, boxShadow: `0 0 6px ${signalColor}50` }}
              />
              {state && (state.signal === 'strong-bullish' || state.signal === 'strong-bearish') && (
                <div
                  className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: signalColor }}
                />
              )}
            </div>

            {/* Compass content - closed mode */}
            {closedContent}

            {/* Expand indicator */}
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              className={cn(
                'shrink-0 text-slate-600 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            >
              <path d="M2 3L4 5L6 3" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
        </TooltipTrigger>
        {!isExpanded && state && (
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{config.name}</span>
                <span
                  className="text-[10px] font-mono px-1 rounded"
                  style={{ color: signalColor, backgroundColor: `${signalColor}15` }}
                >
                  {state.signal}
                </span>
              </div>
              <div className="text-slate-400 text-[10px]">{config.description}</div>
              <div className="flex items-center gap-3 text-[10px]">
                <span>
                  Value: <span className="font-mono" style={{ color: signalColor }}>{state.value > 0 ? '+' : ''}{state.value.toFixed(1)}</span>
                </span>
                <span>
                  Conf: <span className="font-mono text-slate-300">{state.confidence}%</span>
                </span>
                <span className="text-slate-500">{formatRelativeTime(state.lastUpdated)}</span>
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Expanded panel - rendered via Portal to avoid overflow clipping */}
      <Portal containerId="compass-expanded-root">
        <AnimatePresence>
          {isExpanded && state && CompassContent && panelPos && (
            <motion.div
              ref={expandedRef}
              data-compass-expanded={config.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed z-50 bg-slate-900/98 border border-slate-700 rounded-b-lg shadow-2xl shadow-black/50 backdrop-blur-sm"
              style={{ minWidth: 220, top: panelPos.top, left: panelPos.left }}
            >
              {/* Layer color accent bar */}
              <div className="h-[2px] w-full" style={{ backgroundColor: layerStyle.accent, opacity: 0.4 }} />
              <Suspense fallback={
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-2.5 w-3/4" />
                </div>
              }>
                <CompassContent state={state} expanded={true} />
              </Suspense>
              {/* Footer with last updated */}
              <div className="px-3 py-1 border-t border-slate-800 text-[8px] text-slate-600 flex justify-between">
                <span>{config.layer.replace('-', ' ').toUpperCase()}</span>
                <span>Updated {formatRelativeTime(state.lastUpdated)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
