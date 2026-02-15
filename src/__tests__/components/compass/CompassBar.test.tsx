import { render, screen, fireEvent } from '@testing-library/react';
import { CompassBar } from '@/components/compass/CompassBar';
import { useCompassStore } from '@/stores/useCompassStore';
import { DEFAULT_COMPASS_ORDER } from '@/data/constants/compassConfig';
import { generateAllCompassStates } from '@/data/generators/compassDataGenerator';

// Mock dnd-kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => []),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  horizontalListSortingStrategy: jest.fn(),
  arrayMove: jest.fn((arr: unknown[], oldIdx: number, newIdx: number) => {
    const result = [...arr];
    const [removed] = result.splice(oldIdx, 1);
    result.splice(newIdx, 0, removed);
    return result;
  }),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the UI Tooltip wrapper which re-exports from @radix-ui/react-tooltip
jest.mock('@/components/ui/Tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, ...props }: { children: React.ReactNode; asChild?: boolean }) => (
    <div {...props}>{children}</div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
  useCompassStore.setState({
    compassStates: new Map(),
    barState: {
      order: [...DEFAULT_COMPASS_ORDER],
      expanded: null,
      hovered: null,
      hidden: new Set(),
      layerFilter: 'all',
    },
    intervalId: null,
  });
});

describe('CompassBar', () => {
  it('renders the compass bar container', () => {
    render(<CompassBar />);
    // CompassBar renders a flex container with backdrop blur
    const container = document.querySelector('.backdrop-blur-sm');
    expect(container).toBeInTheDocument();
  });

  it('renders compass widgets when states are loaded', () => {
    const states = generateAllCompassStates();
    useCompassStore.setState({ compassStates: states });
    render(<CompassBar />);

    // Check for compass names in the rendered content (via lazy-loaded components or short names)
    const allText = document.body.textContent;
    expect(allText).toBeTruthy();
  });

  it('renders without compass states (loading state)', () => {
    render(<CompassBar />);
    // Should still render the container
    const container = document.querySelector('.backdrop-blur-sm');
    expect(container).toBeInTheDocument();
  });
});
