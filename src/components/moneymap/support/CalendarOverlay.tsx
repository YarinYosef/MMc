'use client';

import { useMemo } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';


const EVENT_TYPES = [
  { type: 'earnings', color: '#AB9FF2', label: 'Earnings' },
  { type: 'dividend', color: '#2EC08B', label: 'Dividend' },
  { type: 'split', color: '#F59E0B', label: 'Split' },
  { type: 'fda', color: '#FF7243', label: 'FDA/Reg' },
  { type: 'conference', color: '#8B5CF6', label: 'Conference' },
  { type: 'lockup', color: '#EC4899', label: 'Lock-up Exp' },
];

interface CalendarEvent {
  date: string;
  type: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
}

function generateEvents(symbol: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const now = new Date();

  for (let i = 0; i < 8; i++) {
    const futureDate = new Date(now.getTime() + (i * 3 + Math.floor(Math.random() * 5)) * 86400000);
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const impacts: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
    events.push({
      date: futureDate.toISOString().split('T')[0],
      type: eventType.type,
      title: `${symbol} ${eventType.label}`,
      impact: impacts[Math.floor(Math.random() * impacts.length)],
    });
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function CalendarOverlay() {
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);
  const events = useMemo(() => {
    if (!selectedSymbol) return [];
    return generateEvents(selectedSymbol);
  }, [selectedSymbol]);

  if (!selectedSymbol) {
    return (
      <div className="h-full flex items-center justify-center text-[#999999] text-xs">
        Select a ticker to view calendar
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-[10px] text-[#999999] px-2 pb-1">
        Upcoming events - {selectedSymbol}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-2">
        {events.map((event, i) => {
          const eventDef = EVENT_TYPES.find((e) => e.type === event.type);
          const impactColor = event.impact === 'high' ? 'text-[#FF7243]' : event.impact === 'medium' ? 'text-[#CD8554]' : 'text-[#999999]';
          return (
            <div
              key={i}
              className="flex items-center gap-2 py-1.5 border-b border-white/[0.05] group hover:bg-white/[0.03] rounded px-1"
            >
              <div
                className="w-1.5 h-8 rounded-full flex-shrink-0"
                style={{ backgroundColor: eventDef?.color || '#6B7280' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white font-medium truncate">{event.title}</span>
                  <span className={`text-[10px] font-semibold uppercase ${impactColor}`}>
                    {event.impact}
                  </span>
                </div>
                <div className="text-[10px] text-[#999999]">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 px-2 py-1 border-t border-white/[0.08]">
        {EVENT_TYPES.map((et) => (
          <div key={et.type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: et.color }} />
            <span className="text-[10px] text-[#999999]">{et.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
