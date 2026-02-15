'use client';

import { WATCHLIST_COLORS } from '@/data/constants/colors';
import { cn } from '@/lib/utils';

interface WatchlistColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function WatchlistColorPicker({ selectedColor, onSelect }: WatchlistColorPickerProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {WATCHLIST_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={cn(
            'w-5 h-5 rounded-full border-2 transition-all hover:scale-110',
            selectedColor === color ? 'border-white scale-110' : 'border-transparent'
          )}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}
