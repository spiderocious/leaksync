'use client';

import { useRef, useState, type PointerEvent } from 'react';

import { AppToast } from '../app-feedback/app-feedback.tsx';
import type { ToastEntry } from './drawer-store.ts';

// A toast that can be swiped horizontally to dismiss. Wraps AppToast. Sticky
// toasts can't be swiped. Pointer-based so it works on touch and mouse.
export interface SwipeableToastProps {
  entry: ToastEntry;
  onDismiss: (id: string) => void;
}

const DISMISS_THRESHOLD = 64;

export function SwipeableToast({ entry, onDismiss }: SwipeableToastProps) {
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (entry.sticky) return;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    setDx(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (startX.current === null) return;
    if (Math.abs(dx) > DISMISS_THRESHOLD) {
      onDismiss(entry.id);
    } else {
      setDx(0);
    }
    startX.current = null;
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        transform: `translateX(${dx}px)`,
        opacity: 1 - Math.min(Math.abs(dx) / 200, 0.6),
        touchAction: 'pan-y',
        cursor: entry.sticky ? 'default' : 'grab',
      }}
    >
      <AppToast
        message={entry.message}
        tone={entry.tone}
        {...(entry.action ? { action: entry.action } : {})}
      />
    </div>
  );
}
