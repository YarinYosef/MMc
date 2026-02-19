'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

const TIME_COLORS: Record<string, string> = {
  green: '#2EC08B',
  yellow: '#F59E0B',
  red: '#FF7243',
  gray: '#6B7280',
};

const TIME_LABELS: Record<string, string> = {
  green: 'Favorable',
  yellow: 'Caution',
  red: 'Unfavorable',
  gray: 'Neutral',
};

export function TimeCompass({ state, expanded }: Props) {
  const d = state.details;
  const timeColorKey = d.timeColor as string;
  const timeColor = TIME_COLORS[timeColorKey] || '#6B7280';
  const timeLabel = TIME_LABELS[timeColorKey] || 'Neutral';
  const seasonality = Number(d.seasonality);
  const calendarRisk = Number(d.calendarRisk);
  const multiTf = Number(d.multiTf);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Time</span>
        {/* Clock SVG */}
        <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0">
          <circle cx="6" cy="6" r="5" fill="none" stroke={timeColor} strokeWidth="1.2" />
          <line x1="6" y1="6" x2="6" y2="3" stroke={timeColor} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="6" y1="6" x2="8" y2="7" stroke={timeColor} strokeWidth="1" strokeLinecap="round" />
        </svg>
        <span className="text-[10px] font-bold" style={{ color: timeColor }}>{timeLabel}</span>
      </div>
    );
  }

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Time Compass</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: timeColor, backgroundColor: `${timeColor}15` }}>
          {timeLabel}
        </span>
      </div>

      {/* Metric bars */}
      <div className="space-y-2 mb-3">
        <MetricBar label="Seasonality" value={seasonality} description="Historical pattern favorability" />
        <MetricBar label="Calendar Risk" value={calendarRisk} invert description="Event proximity risk" />
        <MetricBar label="Multi-Timeframe" value={multiTf} description="Alignment across TFs" />
      </div>

      {/* Calendar events */}
      <div className="border-t border-white/[0.08] pt-2">
        <div className="text-[10px] text-[#777777] uppercase tracking-wider mb-1.5 font-semibold">Calendar Events</div>
        <div className="grid grid-cols-2 gap-1.5">
          <CalendarItem label="Day" value={`${d.dayOfWeek}, ${d.monthName}`} />
          <CalendarItem
            label="OPEX"
            value={d.isOpex as string}
            highlight={d.isOpex === 'Yes'}
          />
          <CalendarItem
            label="Earnings"
            value={d.earningsWeek as string}
            highlight={d.earningsWeek === 'Yes'}
          />
          <CalendarItem
            label="FOMC"
            value={d.fomc as string}
            highlight={d.fomc === 'Upcoming'}
            danger={d.fomc === 'Upcoming'}
          />
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, invert = false, description }: { label: string; value: number; invert?: boolean; description: string }) {
  const adjusted = invert ? 100 - value : value;
  const c = adjusted > 65 ? '#2EC08B' : adjusted > 40 ? '#F59E0B' : '#FF7243';

  return (
    <div>
      <div className="flex justify-between text-[11px] mb-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[#999999]">{label}</span>
          <span className="text-[7px] text-[#777777]">({description})</span>
        </div>
        <span className="font-mono font-bold" style={{ color: c }}>{value}</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: c }}
        />
      </div>
    </div>
  );
}

function CalendarItem({ label, value, highlight = false, danger = false }: { label: string; value: string; highlight?: boolean; danger?: boolean }) {
  const textColor = danger ? '#FF7243' : highlight ? '#F59E0B' : '#9CA3AF';
  return (
    <div className="bg-white/[0.03] rounded px-2 py-1">
      <div className="text-[9px] text-[#777777]">{label}</div>
      <div className="text-[11px] font-bold" style={{ color: textColor }}>{value}</div>
    </div>
  );
}
