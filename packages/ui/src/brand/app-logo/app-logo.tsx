import { cn } from '../../utils/cn.ts';

// AppLogo / AppTrayIcon — the brand mark: a stack glyph drawn as single
// strokes. One mark, drawn once: the Android app icon (ink on paper, ringed in
// moss), the Mac tray icon (monochrome, a moss pip when something lands).
// Spec: design-system/projects/leaksync/preview/41-icons.html (and 30-menu-bar)

function StackGlyph({ size = 24, strokeWidth = 1.6 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="4" y="5" width="16" height="4" rx="1" />
      <rect x="4" y="11" width="16" height="4" rx="1" />
      <rect x="6" y="17" width="12" height="3" rx="1" />
    </svg>
  );
}

// ---------- The bare mark ----------

export interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 24, className }: AppLogoProps) {
  return (
    <span className={cn('inline-flex text-ink', className)}>
      <StackGlyph size={size} />
    </span>
  );
}

// ---------- The Android app icon ----------

export interface AppIconProps {
  size?: number;
  className?: string;
}

export function AppIcon({ size = 52, className }: AppIconProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-[12px] bg-ink text-paper shadow-[0_0_0_2px_var(--moss)]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <StackGlyph size={Math.round(size / 2)} />
    </span>
  );
}

// ---------- The Mac tray icon ----------

export interface AppTrayIconProps {
  /** When true, shows the single moss pip (an unseen item is waiting). */
  hasNew?: boolean;
  size?: number;
  className?: string;
}

export function AppTrayIcon({ hasNew = false, size = 22, className }: AppTrayIconProps) {
  return (
    <span className={cn('relative inline-flex text-ink-2', className)}>
      <StackGlyph size={size} strokeWidth={1.5} />
      {hasNew ? (
        <span
          className="absolute right-0 top-0 h-[6px] w-[6px] rounded-full bg-moss"
          style={{ transform: 'translate(2px, -1px)' }}
          aria-label="new item"
        />
      ) : null}
    </span>
  );
}
