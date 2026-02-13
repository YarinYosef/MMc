'use client';

import { useOnionStore } from '@/stores/useOnionStore';

export function OnionControls() {
  const { drillPath, resetDrill, drillUp } = useOnionStore();

  if (drillPath.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/30 border-t border-slate-700/50">
      <span className="text-[10px] text-slate-500">
        Depth: {drillPath.length} / 4
      </span>
      <div className="flex-1" />
      {drillPath.length > 0 && (
        <button
          onClick={drillUp}
          className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-700/50 hover:bg-slate-700"
        >
          Up one level
        </button>
      )}
      <button
        onClick={resetDrill}
        className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-700/50 hover:bg-slate-700"
      >
        Reset all
      </button>
    </div>
  );
}
