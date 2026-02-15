'use client';

import { useId, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type WatchlistGroup as WatchlistGroupType, type NotificationFrequency } from '@/data/types/watchlist';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { WatchlistItemRow } from './WatchlistItem';
import { WatchlistColorPicker } from './WatchlistColorPicker';
import { cn } from '@/lib/utils';

interface WatchlistGroupProps {
  group: WatchlistGroupType;
  isActive: boolean;
  dragListeners?: Record<string, unknown>;
}

function SortableWatchlistItem({
  symbol,
  groupId,
  groupColor,
}: {
  symbol: string;
  groupId: string;
  groupColor: string;
}) {
  const tickers = useMarketStore((s) => s.tickers);
  const group = useWatchlistStore((s) => s.groups.find((g) => g.id === groupId));
  const item = group?.items.find((i) => i.symbol === symbol);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: symbol });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!item) return null;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center">
        {/* Drag handle */}
        <button
          {...listeners}
          className="px-0.5 py-1 text-[#777777] hover:text-[#999999] cursor-grab active:cursor-grabbing shrink-0"
          title="Drag to reorder"
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
            <circle cx="2" cy="2" r="1" />
            <circle cx="6" cy="2" r="1" />
            <circle cx="2" cy="6" r="1" />
            <circle cx="6" cy="6" r="1" />
            <circle cx="2" cy="10" r="1" />
            <circle cx="6" cy="10" r="1" />
          </svg>
        </button>
        <div className="flex-1">
          <WatchlistItemRow
            item={item}
            groupId={groupId}
            groupColor={groupColor}
            ticker={tickers.get(item.symbol)}
            isDragging={isDragging}
          />
        </div>
      </div>
    </div>
  );
}

export function WatchlistGroupSection({ group, isActive, dragListeners }: WatchlistGroupProps) {
  const dndId = useId();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifConfig, setShowNotifConfig] = useState(false);

  const renameGroup = useWatchlistStore((s) => s.renameGroup);
  const deleteGroup = useWatchlistStore((s) => s.deleteGroup);
  const setGroupColor = useWatchlistStore((s) => s.setGroupColor);
  const setActiveGroup = useWatchlistStore((s) => s.setActiveGroup);
  const notificationPrefs = useWatchlistStore((s) => s.notificationPrefs);
  const setNotificationPref = useWatchlistStore((s) => s.setNotificationPref);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const groupPrefs = notificationPrefs.find((p) => p.groupId === group.id);

  const handleSaveName = () => {
    if (editName.trim()) {
      renameGroup(group.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = group.items.findIndex((i) => i.symbol === active.id);
    const newIndex = group.items.findIndex((i) => i.symbol === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Reorder within same group using moveItem (from→to same group)
      const store = useWatchlistStore.getState();
      store.moveItem(group.id, group.id, active.id as string, newIndex);
    }
  };

  return (
    <div className="border-b border-black last:border-b-0">
      {/* Group header */}
      <div
        className={cn(
          'group flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-colors',
          isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
        )}
        onClick={() => {
          setActiveGroup(group.id);
          setIsCollapsed(!isCollapsed);
        }}
      >
        {/* Group drag handle */}
        {dragListeners && (
          <button
            {...dragListeners}
            onClick={(e) => e.stopPropagation()}
            className="text-[#777777] hover:text-[#999999] cursor-grab active:cursor-grabbing shrink-0 -ml-0.5 mr-0.5"
            title="Drag to reorder watchlist"
          >
            <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
              <circle cx="1.5" cy="1.5" r="1" />
              <circle cx="4.5" cy="1.5" r="1" />
              <circle cx="1.5" cy="5" r="1" />
              <circle cx="4.5" cy="5" r="1" />
              <circle cx="1.5" cy="8.5" r="1" />
              <circle cx="4.5" cy="8.5" r="1" />
            </svg>
          </button>
        )}

        {/* Color dot */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          className="w-3 h-3 rounded-full shrink-0 hover:ring-2 ring-white/30 transition-all"
          style={{ backgroundColor: group.color }}
        />

        {/* Collapse arrow */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={cn(
            'text-[#777777] shrink-0 transition-transform',
            isCollapsed && '-rotate-90'
          )}
        >
          <path d="M4 6l4 4 4-4" />
        </svg>

        {/* Name */}
        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveName();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-white/[0.06] border border-black rounded px-1 py-0 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#AB9FF2]"
          />
        ) : (
          <span
            className="flex-1 text-xs font-medium truncate"
            style={{ color: group.color }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditName(group.name);
              setIsEditing(true);
            }}
          >
            {group.name}
          </span>
        )}

        {/* Item count */}
        <span className="text-[10px] text-[#999999] shrink-0">
          {group.items.length}
        </span>

        {/* Notification config */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNotifConfig(!showNotifConfig);
          }}
          className={cn(
            'p-0.5 transition-colors shrink-0',
            groupPrefs?.email || groupPrefs?.phone
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-[#777777] hover:text-[#999999] opacity-0 group-hover:opacity-100'
          )}
          title="Notification settings"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1a1 1 0 011 1v.5A4.5 4.5 0 0112.5 7v3l1.5 2H2l1.5-2V7A4.5 4.5 0 017 2.5V2a1 1 0 011-1zM6 13a2 2 0 004 0H6z" />
          </svg>
        </button>

        {/* Edit button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditName(group.name);
            setIsEditing(true);
          }}
          className="p-0.5 text-[#777777] hover:text-[#999999] opacity-0 group-hover:opacity-100 transition-all shrink-0"
          title="Rename"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 1l4 4-9 9H2v-4l9-9z" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteGroup(group.id);
          }}
          className="p-0.5 text-[#777777] hover:text-red-400 transition-colors shrink-0"
          title="Delete watchlist"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      {/* Color picker (inline) */}
      {showColorPicker && (
        <div className="px-3 py-2 bg-white/[0.03] border-b border-black">
          <WatchlistColorPicker
            selectedColor={group.color}
            onSelect={(color) => {
              setGroupColor(group.id, color);
              setShowColorPicker(false);
            }}
          />
        </div>
      )}

      {/* Notification config (inline) */}
      {showNotifConfig && (
        <div className="px-3 py-2 bg-white/[0.03] border-b border-black space-y-1.5">
          <span className="text-[10px] text-[#999999] uppercase tracking-wider">Notifications</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-[10px] text-[#999999] cursor-pointer">
              <input
                type="checkbox"
                checked={groupPrefs?.email ?? false}
                onChange={(e) => setNotificationPref(group.id, { email: e.target.checked })}
                className="w-3 h-3 rounded border-black bg-white/[0.06] text-[#AB9FF2] focus:ring-0"
              />
              Email
            </label>
            <label className="flex items-center gap-1 text-[10px] text-[#999999] cursor-pointer">
              <input
                type="checkbox"
                checked={groupPrefs?.phone ?? false}
                onChange={(e) => setNotificationPref(group.id, { phone: e.target.checked })}
                className="w-3 h-3 rounded border-black bg-white/[0.06] text-[#AB9FF2] focus:ring-0"
              />
              Phone
            </label>
            <label className="flex items-center gap-1 text-[10px] text-[#999999] cursor-pointer">
              <input
                type="checkbox"
                checked={groupPrefs?.inApp ?? true}
                onChange={(e) => setNotificationPref(group.id, { inApp: e.target.checked })}
                className="w-3 h-3 rounded border-black bg-white/[0.06] text-[#AB9FF2] focus:ring-0"
              />
              In-App
            </label>
          </div>
          {/* Frequency selector */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#999999] shrink-0">Frequency:</span>
            {(['immediate', 'hourly', 'daily'] as NotificationFrequency[]).map((freq) => (
              <button
                key={freq}
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationPref(group.id, { frequency: freq });
                }}
                className={cn(
                  'px-1.5 py-0.5 text-[9px] rounded transition-colors capitalize',
                  (groupPrefs?.frequency ?? 'immediate') === freq
                    ? 'bg-[#AB9FF2]/20 text-[#AB9FF2] border border-[#AB9FF2]/30'
                    : 'bg-white/[0.06] text-[#777777] hover:text-[#999999] border border-transparent'
                )}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items with drag-and-drop */}
      {!isCollapsed && (
        <div ref={scrollContainerRef} className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {group.items.length === 0 ? (
            <div className="px-3 py-2 text-[10px] text-[#999999] text-center">
              No items. Use search to add.
            </div>
          ) : (
            <div className="min-w-max">
              <DndContext
                id={dndId}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={group.items.map((i) => i.symbol)}
                  strategy={verticalListSortingStrategy}
                >
                  {group.items.map((item) => (
                    <SortableWatchlistItem
                      key={item.symbol}
                      symbol={item.symbol}
                      groupId={group.id}
                      groupColor={group.color}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
