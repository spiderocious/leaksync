import { lazy, type LazyExoticComponent } from 'react';

// The single source of truth for the design-system preview gallery.
//
// To add a component to the gallery:
//   1. Create a part file under ../screen/parts (e.g. `02-input.tsx`) exporting a
//      named component, following the 01-buttons.tsx shape.
//   2. Add one entry to PARTS below — id, label, group, and the lazy loader.
// The sidebar nav and the canvas router both derive from this list, so there's
// nothing else to wire up.
//
// Phase 2 ships the harness with a couple of placeholder parts. Phase 3 (the
// design-system agent) fills it out with the real LeakSync components.

export type PreviewGroup = 'Foundation' | 'Primitives' | 'Display' | 'Feedback';

type PartComponent = LazyExoticComponent<() => React.ReactElement>;

export interface PreviewPart {
  readonly id: string;
  readonly label: string;
  readonly group: PreviewGroup;
  readonly Component: PartComponent;
}

// Render order of groups in the sidebar.
export const PREVIEW_GROUPS: readonly PreviewGroup[] = [
  'Foundation',
  'Primitives',
  'Display',
  'Feedback',
];

export const PARTS: readonly PreviewPart[] = [
  {
    id: 'typography',
    label: 'Typography',
    group: 'Foundation',
    Component: lazy(() =>
      import('../screen/parts/00-typography.tsx').then((m) => ({ default: m.TypographyPart })),
    ),
  },
  {
    id: 'buttons',
    label: 'Button',
    group: 'Primitives',
    Component: lazy(() =>
      import('../screen/parts/01-buttons.tsx').then((m) => ({ default: m.ButtonsPart })),
    ),
  },
];

export const DEFAULT_PART_ID = PARTS[0]?.id ?? '';

export function findPart(id: string): PreviewPart | undefined {
  return PARTS.find((part) => part.id === id);
}
