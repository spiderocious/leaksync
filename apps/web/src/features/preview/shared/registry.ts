import { lazy, type LazyExoticComponent } from 'react';

// The single source of truth for the design-system preview gallery.
//
// To add a component to the gallery:
//   1. Create a part file under ../screen/parts with a DESCRIPTIVE name
//      (e.g. `item-row.tsx`, never `16-item-row.tsx`), exporting a named part
//      component, following the typography.tsx shape.
//   2. Add one entry to PARTS below — id, label, group, and the lazy loader.
// The sidebar nav and the canvas router both derive from this list. Render
// order in the sidebar comes from THIS array's order — not from filename
// number prefixes.

export type PreviewGroup = 'Foundation' | 'Primitives' | 'Display' | 'Overlays' | 'Surfaces';

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
  'Overlays',
  'Surfaces',
];

export const PARTS: readonly PreviewPart[] = [
  {
    id: 'typography',
    label: 'Type',
    group: 'Foundation',
    Component: lazy(() =>
      import('../screen/parts/typography').then((m) => ({ default: m.TypographyPart })),
    ),
  },
  {
    id: 'brand',
    label: 'Brand mark',
    group: 'Foundation',
    Component: lazy(() =>
      import('../screen/parts/brand').then((m) => ({ default: m.BrandPart })),
    ),
  },
  {
    id: 'buttons',
    label: 'Button',
    group: 'Primitives',
    Component: lazy(() =>
      import('../screen/parts/buttons').then((m) => ({ default: m.ButtonsPart })),
    ),
  },
  {
    id: 'status',
    label: 'Status & connection',
    group: 'Primitives',
    Component: lazy(() =>
      import('../screen/parts/status').then((m) => ({ default: m.StatusPart })),
    ),
  },
  {
    id: 'pairing-code',
    label: 'Pairing code',
    group: 'Primitives',
    Component: lazy(() =>
      import('../screen/parts/pairing-code').then((m) => ({ default: m.PairingCodePart })),
    ),
  },
  {
    id: 'item-row',
    label: 'Item row',
    group: 'Primitives',
    Component: lazy(() =>
      import('../screen/parts/item-row').then((m) => ({ default: m.ItemRowPart })),
    ),
  },
  {
    id: 'recent-list',
    label: 'Recent list',
    group: 'Display',
    Component: lazy(() =>
      import('../screen/parts/recent-list').then((m) => ({ default: m.RecentListPart })),
    ),
  },
  {
    id: 'empty-state',
    label: 'Empty states',
    group: 'Display',
    Component: lazy(() =>
      import('../screen/parts/empty-state').then((m) => ({ default: m.EmptyStatePart })),
    ),
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    group: 'Display',
    Component: lazy(() =>
      import('../screen/parts/skeleton').then((m) => ({ default: m.SkeletonPart })),
    ),
  },
  {
    id: 'modals',
    label: 'Modals',
    group: 'Overlays',
    Component: lazy(() =>
      import('../screen/parts/modals').then((m) => ({ default: m.ModalsPart })),
    ),
  },
  {
    id: 'feedback',
    label: 'Toast & banner',
    group: 'Overlays',
    Component: lazy(() =>
      import('../screen/parts/feedback').then((m) => ({ default: m.FeedbackPart })),
    ),
  },
  {
    id: 'drawer-service',
    label: 'DrawerService',
    group: 'Overlays',
    Component: lazy(() =>
      import('../screen/parts/drawer-service').then((m) => ({ default: m.DrawerServicePart })),
    ),
  },
  {
    id: 'menu-bar',
    label: 'Menu-bar popup',
    group: 'Surfaces',
    Component: lazy(() =>
      import('../screen/parts/menu-bar').then((m) => ({ default: m.MenuBarPart })),
    ),
  },
  {
    id: 'pairing',
    label: 'First-run pairing',
    group: 'Surfaces',
    Component: lazy(() =>
      import('../screen/parts/pairing').then((m) => ({ default: m.PairingPart })),
    ),
  },
  {
    id: 'notification',
    label: 'Notification & arrival',
    group: 'Surfaces',
    Component: lazy(() =>
      import('../screen/parts/notification').then((m) => ({ default: m.NotificationPart })),
    ),
  },
  {
    id: 'android',
    label: 'The Android side',
    group: 'Surfaces',
    Component: lazy(() =>
      import('../screen/parts/android').then((m) => ({ default: m.AndroidPart })),
    ),
  },
  {
    id: 'settings',
    label: 'Settings & About',
    group: 'Surfaces',
    Component: lazy(() =>
      import('../screen/parts/settings').then((m) => ({ default: m.SettingsPart })),
    ),
  },
];

export const DEFAULT_PART_ID = PARTS[0]?.id ?? '';

export function findPart(id: string): PreviewPart | undefined {
  return PARTS.find((part) => part.id === id);
}
