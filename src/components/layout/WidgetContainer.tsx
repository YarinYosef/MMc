'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WidgetContainerProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  noPadding?: boolean;
}

export function WidgetContainer({
  id,
  title,
  children,
  className,
  headerActions,
  noPadding = false,
}: WidgetContainerProps) {
  return (
    <div
      id={id}
      className={cn(
        'bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {title}
          </h3>
          {headerActions && (
            <div className="flex items-center gap-1">{headerActions}</div>
          )}
        </div>
      )}
      <div className={cn('flex-1 overflow-hidden', !noPadding && 'p-3')}>
        {children}
      </div>
    </div>
  );
}
