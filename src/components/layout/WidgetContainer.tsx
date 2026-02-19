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
        'bg-[#131313] border border-black rounded-[var(--radius-widget)] overflow-hidden flex flex-col',
        className
      )}
      style={{
        boxShadow:
          'rgba(255,255,255,0.03) 0px 1px 0px 0px inset, rgba(255,255,255,0.03) -1px 0px 0px 0px inset, rgba(255,255,255,0.03) 1px 0px 0px 0px inset',
      }}
    >
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-black bg-white/[0.02]">
          <h3 className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
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
