'use client';

import { useCallback } from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';

export function useWidgetDrag(widgetId: string, widgetType: string) {
  const { isDragging, dragSource, dragTarget, startDrag, setDragTarget, endDrag } =
    useLayoutStore();

  const canAcceptDrop = useCallback(
    (sourceType: string) => {
      // Widgets can only swap within the same type
      return sourceType === widgetType;
    },
    [widgetType]
  );

  const handleDragStart = useCallback(() => {
    startDrag(widgetId);
  }, [widgetId, startDrag]);

  const handleDragOver = useCallback(() => {
    if (isDragging && dragSource !== widgetId) {
      setDragTarget(widgetId);
    }
  }, [isDragging, dragSource, widgetId, setDragTarget]);

  const handleDrop = useCallback(() => {
    endDrag();
  }, [endDrag]);

  const isBeingDragged = isDragging && dragSource === widgetId;
  const isDropTarget = isDragging && dragTarget === widgetId;

  return {
    isDragging: isBeingDragged,
    isDropTarget,
    handleDragStart,
    handleDragOver,
    handleDrop,
    canAcceptDrop,
  };
}
