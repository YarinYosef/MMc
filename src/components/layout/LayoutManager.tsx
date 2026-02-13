'use client';

import { useState } from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';

export function LayoutManager() {
  const { savedLayouts, currentLayoutId, saveCurrentLayout, loadLayout, deleteLayout } =
    useLayoutStore();
  const [newLayoutName, setNewLayoutName] = useState('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 text-xs">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-1">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Layouts
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Saved Layouts</DropdownMenuLabel>
        {savedLayouts.map((layout) => (
          <DropdownMenuItem
            key={layout.id}
            onClick={() => loadLayout(layout.id)}
            className={layout.id === currentLayoutId ? 'bg-slate-700' : ''}
          >
            <span className="flex-1">{layout.name}</span>
            {layout.id !== 'default' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLayout(layout.id);
                }}
                className="text-slate-500 hover:text-red-400 ml-2"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="flex gap-1">
            <input
              type="text"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="New layout name..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newLayoutName.trim()) {
                  saveCurrentLayout(newLayoutName.trim());
                  setNewLayoutName('');
                }
              }}
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                if (newLayoutName.trim()) {
                  saveCurrentLayout(newLayoutName.trim());
                  setNewLayoutName('');
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
