import { Repeat } from 'meemaw';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { drawerStore, type ToastEntry, type ToastPosition } from './drawer-store.ts';
import { SwipeableToast } from './swipeable-toast.tsx';

// ToastHost — mounts once at the app root. Renders all live toasts grouped into
// six screen zones. useSyncExternalStore keeps it in sync with the store.

const ZONES: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const ZONE_CLASSES: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

export function ToastHost() {
  const state = useSyncExternalStore(drawerStore.subscribe, drawerStore.getState);
  if (state.toasts.length === 0) return null;

  return createPortal(
    <>
      <Repeat each={ZONES}>
        {(zone: ToastPosition) => {
          const toasts = state.toasts.filter((t: ToastEntry) => t.position === zone);
          if (toasts.length === 0) return null;
          return (
            <div key={zone} className={`pointer-events-none fixed z-[1100] flex flex-col gap-2 ${ZONE_CLASSES[zone]}`}>
              <Repeat each={[...toasts]}>
                {(t: ToastEntry) => (
                  <div key={t.id} className="pointer-events-auto">
                    <SwipeableToast entry={t} onDismiss={drawerStore.dismissToast} />
                  </div>
                )}
              </Repeat>
            </div>
          );
        }}
      </Repeat>
    </>,
    document.body,
  );
}
