'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function Portal({ children, containerId = 'portal-root' }: PortalProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    // Ensure portal container exists
    if (!document.getElementById(containerId)) {
      const el = document.createElement('div');
      el.id = containerId;
      document.body.appendChild(el);
    }
  }, [containerId]);

  if (!mounted) return null;

  const container = document.getElementById(containerId);
  if (!container) return null;

  return createPortal(children, container);
}
