'use client';

import { cn } from '@/lib/utils';

interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className }: DragHandleProps) {
  return (
    <div
      className={cn(
        'cursor-grab active:cursor-grabbing flex items-center justify-center',
        'text-slate-500 hover:text-slate-300 transition-colors',
        className
      )}
      aria-label="Drag handle"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="3" cy="3" r="1.5" />
        <circle cx="9" cy="3" r="1.5" />
        <circle cx="3" cy="9" r="1.5" />
        <circle cx="9" cy="9" r="1.5" />
      </svg>
    </div>
  );
}
