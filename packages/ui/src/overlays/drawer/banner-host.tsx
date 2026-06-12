'use client';

import { Repeat } from 'meemaw';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { AppBanner } from '../app-feedback/app-feedback.tsx';
import { drawerStore, type BannerEntry } from './drawer-store.ts';

// BannerHost — mounts once at the app root. Renders persistent banner strips at
// the top and bottom of the viewport.
export function BannerHost() {
  const state = useSyncExternalStore(drawerStore.subscribe, drawerStore.getState);
  if (state.banners.length === 0) return null;

  const top = state.banners.filter((b: BannerEntry) => b.position === 'top');
  const bottom = state.banners.filter((b: BannerEntry) => b.position === 'bottom');

  return createPortal(
    <>
      <Show banners={top} className="top-0" />
      <Show banners={bottom} className="bottom-0" />
    </>,
    document.body,
  );
}

function Show({ banners, className }: { banners: BannerEntry[]; className: string }) {
  if (banners.length === 0) return null;
  return (
    <div className={`fixed inset-x-0 z-[1050] flex flex-col gap-2 p-3 ${className}`}>
      <Repeat each={[...banners]}>
        {(b: BannerEntry) => (
          <div key={b.id} className="mx-auto w-full max-w-[420px]">
            <AppBanner
              title={b.title}
              tone={b.tone}
              {...(b.description !== undefined ? { description: b.description } : {})}
              {...(b.icon !== undefined ? { icon: b.icon } : {})}
              cta={{
                label: b.cta?.label ?? 'Dismiss',
                onClick: () => {
                  b.cta?.onClick();
                  drawerStore.dismissBanner(b.id);
                },
              }}
            />
          </div>
        )}
      </Repeat>
    </div>
  );
}
