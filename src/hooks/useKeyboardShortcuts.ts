'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';

interface ShortcutConfig {
  key: string;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const toggleManagingPane = useLayoutStore((s) => s.toggleManagingPane);
  const setManagingTab = useLayoutStore((s) => s.setManagingTab);
  const toggleWatchlist = useWatchlistStore((s) => s.toggleOpen);
  const toggleLayoutManager = useLayoutStore((s) => s.toggleLayoutManager);
  const toggleRatingOverlay = useLayoutStore((s) => s.toggleRatingOverlay);

  const shortcuts: ShortcutConfig[] = useMemo(() => [
    {
      key: ' ',
      shift: true,
      action: toggleManagingPane,
      description: 'Toggle Managing Panel',
    },
    {
      key: 'w',
      ctrl: true,
      action: toggleWatchlist,
      description: 'Toggle Watchlist',
    },
    {
      key: 'Escape',
      action: () => {
        // ESC toggles the layout manager panel
        toggleLayoutManager();
      },
      description: 'Toggle Layout Manager',
    },
    {
      key: 'Alt',
      action: () => {
        // Alt opens managing pane on feedback tab
        const state = useLayoutStore.getState();
        if (state.managingPane.isOpen && state.managingPane.activeTab === 'feedback') {
          // If already open on feedback, close it
          toggleManagingPane();
        } else {
          // Open managing pane and switch to feedback tab
          if (!state.managingPane.isOpen) {
            toggleManagingPane();
          }
          setManagingTab('feedback');
        }
      },
      description: 'Open Dev Feedback',
    },
  ], [toggleManagingPane, toggleWatchlist, toggleLayoutManager, setManagingTab]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Handle Alt key specially - it fires on keydown with key === 'Alt'
      if (e.key === 'Alt' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Don't prevent default on Alt alone to avoid browser menu issues
        // We handle it on keyup instead
        return;
      }

      for (const shortcut of shortcuts) {
        if (shortcut.key === 'Alt') continue; // handled separately on keyup

        const keyMatch = e.key === shortcut.key;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey);
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && shiftMatch && ctrlMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      // Alt key: trigger on keyup to avoid browser menu activation issues
      if (e.key === 'Alt' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const altShortcut = shortcuts.find((s) => s.key === 'Alt');
        if (altShortcut) {
          altShortcut.action();
        }
      }
    },
    [shortcuts]
  );

  // Right-click + Shift triggers rating overlay
  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        toggleRatingOverlay();
      }
    },
    [toggleRatingOverlay]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleKeyDown, handleKeyUp, handleContextMenu]);

  return shortcuts;
}
