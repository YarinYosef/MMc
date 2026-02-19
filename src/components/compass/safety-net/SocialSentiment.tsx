'use client';

import { type CompassState } from '@/data/types/compass';

interface Props {
  state: CompassState;
  expanded: boolean;
}

function moodColor(mood: string): string {
  switch (mood) {
    case 'Panic': return '#FF7243';
    case 'Afraid': return '#FCA5A5';
    case 'Neutral': return '#9CA3AF';
    case 'Greedy': return '#86EFAC';
    case 'Euphoric': return '#2EC08B';
    default: return '#9CA3AF';
  }
}

function scoreColor(score: number): string {
  if (score > 70) return '#2EC08B';
  if (score > 55) return '#86EFAC';
  if (score > 45) return '#9CA3AF';
  if (score > 30) return '#FCA5A5';
  return '#FF7243';
}

export function SocialSentiment({ state, expanded }: Props) {
  const d = state.details;
  const mood = d.mood as string;
  const color = moodColor(mood);
  const idx = Number(d.sentimentIndex);
  const twitterScore = Number(d.twitterScore);
  const redditScore = Number(d.redditScore);
  const newsScore = Number(d.newsScore);

  if (!expanded) {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="text-[11px] font-semibold text-[#999999]">Social</span>
        <span className="text-[11px] font-bold" style={{ color }}>{mood}</span>
        <span className="text-[10px] font-mono text-[#777777]">{idx}</span>
      </div>
    );
  }

  const channels = [
    { label: 'X / Twitter', value: twitterScore, icon: 'X' },
    { label: 'Reddit', value: redditScore, icon: 'R' },
    { label: 'News Media', value: newsScore, icon: 'N' },
  ];

  return (
    <div className="p-3 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#999999]">Social Sentiment</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, backgroundColor: `${color}15` }}>
          {mood}
        </span>
      </div>

      {/* Composite index gauge */}
      <div className="bg-white/[0.03] rounded px-3 py-2 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#777777]">Composite Index</span>
          <span className="text-lg font-mono font-bold" style={{ color }}>{idx}</span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${idx}%`,
              background: 'linear-gradient(to right, #FF7243, #FCA5A5, #9CA3AF, #86EFAC, #2EC08B)',
            }}
          />
        </div>
        <div className="flex justify-between text-[7px] text-[#777777] mt-0.5">
          <span>Panic</span>
          <span>Neutral</span>
          <span>Euphoric</span>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="space-y-2">
        {channels.map(({ label, value, icon }) => {
          const c = scoreColor(value);
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold bg-white/[0.06] text-[#999999]">
                    {icon}
                  </span>
                  <span className="text-[11px] text-[#999999]">{label}</span>
                </div>
                <span className="text-[11px] font-mono font-bold" style={{ color: c }}>{value}</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: c }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
