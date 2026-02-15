'use client';

import { type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface ChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  /** Optional subtitle shown below the title */
  subtitle?: string;
}

export function ChartModal({ open, onOpenChange, title, children, subtitle }: ChartModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-7xl w-full h-[85vh] max-h-[900px] flex flex-col bg-[#131313]/95 border-black backdrop-blur-md">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-base font-bold text-white">
              {title}
            </DialogTitle>
            {subtitle && (
              <span className="text-[11px] text-[#777777]">{subtitle}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[#999999] hover:text-white hover:bg-white/[0.06]"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </DialogClose>
          </div>
        </div>
        <div className="flex-1 overflow-hidden mt-3 rounded-md border border-black bg-black/50">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
