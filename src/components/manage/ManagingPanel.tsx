'use client';

import { useLayoutStore } from '@/stores/useLayoutStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { NotesEditor } from './NotesEditor';
import { TodoList } from './TodoList';
import { ScheduledAlerts } from './ScheduledAlerts';
import { DevFeedback } from './DevFeedback';

const TABS = [
  { id: 'notes' as const, label: 'Notes' },
  { id: 'todo' as const, label: 'Todo' },
  { id: 'alerts' as const, label: 'Alerts' },
  { id: 'feedback' as const, label: 'Feedback' },
];

export function ManagingPanel() {
  const { managingPane, toggleManagingPane, setManagingTab } = useLayoutStore();

  const renderContent = () => {
    switch (managingPane.activeTab) {
      case 'notes': return <NotesEditor />;
      case 'todo': return <TodoList />;
      case 'alerts': return <ScheduledAlerts />;
      case 'feedback': return <DevFeedback />;
      default: return null;
    }
  };

  return (
    <div className="bg-[#131313] border border-black rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black">
        <h2 className="text-sm font-semibold text-white">Managing Panel</h2>
        <Button variant="ghost" size="icon" onClick={toggleManagingPane}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setManagingTab(tab.id)}
            className={cn(
              'flex-1 px-3 py-2 text-xs font-medium transition-colors',
              managingPane.activeTab === tab.id
                ? 'text-[#AB9FF2] border-b-2 border-blue-400'
                : 'text-[#999999] hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 min-h-[300px] overflow-hidden">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/[0.08] text-center">
        <span className="text-[10px] text-[#999999]">Press Shift+Space to toggle</span>
      </div>
    </div>
  );
}
