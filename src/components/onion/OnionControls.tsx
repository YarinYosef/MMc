'use client';

import { useOnionStore } from '@/stores/useOnionStore';

export function OnionControls() {
  const { drillPath, resetDrill, drillUp } = useOnionStore();

  if (drillPath.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border-t border-white/[0.08]">
      <span className="text-[10px] text-[#777777]">
        Depth: {drillPath.length} / 4
      </span>
      <div className="flex-1" />
      {drillPath.length > 0 && (
        <button
          onClick={drillUp}
          className="text-[10px] text-[#999999] hover:text-white px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.06]"
        >
          Up one level
        </button>
      )}
      <button
        onClick={resetDrill}
        className="text-[10px] text-[#999999] hover:text-white px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.06]"
      >
        Reset all
      </button>
    </div>
  );
}
