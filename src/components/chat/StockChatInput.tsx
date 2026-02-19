'use client';

import { useState, useCallback, useRef } from 'react';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { TICKER_UNIVERSE } from '@/data/constants/tickers';
import { cn } from '@/lib/utils';

function resolveSymbol(input: string): string | null {
  const query = input.trim().toUpperCase();
  if (!query) return null;

  const exactSymbol = TICKER_UNIVERSE.find((t) => t.symbol === query);
  if (exactSymbol) return exactSymbol.symbol;

  const exactName = TICKER_UNIVERSE.find(
    (t) => t.name.toUpperCase() === query
  );
  if (exactName) return exactName.symbol;

  const partialName = TICKER_UNIVERSE.find((t) =>
    t.name.toUpperCase().includes(query)
  );
  if (partialName) return partialName.symbol;

  // Fall back to treating the input as a raw ticker symbol
  return input.trim().toUpperCase();
}

const NAV_PAGES = [
  {
    id: 'managing',
    label: 'Managing Panel',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
    action: 'toggleManagingPane' as const,
  },
  {
    id: 'layout',
    label: 'Layout Manager',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    action: 'toggleLayoutManager' as const,
  },
];

export function StockChatInput() {
  const [value, setValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const setSelectedSymbol = useDetailsStore((s) => s.setSelectedSymbol);
  const toggleManagingPane = useLayoutStore((s) => s.toggleManagingPane);
  const toggleLayoutManager = useLayoutStore((s) => s.toggleLayoutManager);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const symbol = resolveSymbol(value);
      if (symbol) {
        setSelectedSymbol(symbol);
        setValue('');
      }
    },
    [value, setSelectedSymbol]
  );

  const handleNavClick = useCallback(
    (action: (typeof NAV_PAGES)[number]['action']) => {
      setMenuOpen(false);
      if (action === 'toggleManagingPane') {
        toggleManagingPane();
      } else if (action === 'toggleLayoutManager') {
        toggleLayoutManager();
      }
    },
    [toggleManagingPane, toggleLayoutManager]
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-2 pointer-events-none">
      <div className="w-full max-w-2xl mx-auto pointer-events-auto relative">
        {/* Hamburger dropdown menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div
              ref={menuRef}
              className="absolute bottom-full left-0 mb-2 z-50 w-48 bg-[#131313] border border-black rounded-[var(--radius-widget)] overflow-hidden"
              style={{ boxShadow: 'rgba(0,0,0,0.2) 0px 2px 4px 0px, rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(255,255,255,0.06) -1px 0px 0px 0px inset, rgba(255,255,255,0.06) 1px 0px 0px 0px inset, rgba(255,255,255,0.06) 0px -1px 0px 0px inset' }}
            >
              {NAV_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handleNavClick(page.action)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#999999] hover:bg-white/[0.06] hover:text-white transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={page.icon} />
                  </svg>
                  {page.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Search bar */}
        <form onSubmit={handleSubmit}>
          <div
            className="flex items-center gap-2 bg-[#131313] border border-black rounded-[var(--radius-widget)] px-2 py-1.5 focus-within:border-[#AB9FF2]/40 transition-colors"
            style={{ boxShadow: 'rgba(255,255,255,0.06) 0px 1px 0px 0px inset, rgba(255,255,255,0.06) -1px 0px 0px 0px inset, rgba(255,255,255,0.06) 1px 0px 0px 0px inset, rgba(255,255,255,0.06) 0px -1px 0px 0px inset' }}
          >
            {/* Hamburger button (left side) */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                'shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors',
                menuOpen
                  ? 'bg-white/[0.08] text-white'
                  : 'text-[#777777] hover:bg-white/[0.06] hover:text-[#999999]'
              )}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Search a stock — e.g. AAPL, Tesla, NVDA'
              className="flex-1 bg-transparent text-white text-sm placeholder-[#555555] outline-none py-1"
            />

            {/* Send button (right side) */}
            <button
              type="submit"
              disabled={!value.trim()}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[#AB9FF2] text-white disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
