// @leaksync/ui — the LeakSync e-ink component library.
// Stance: e-ink quietude (see packages/ui/src/styles.css). Consumed as source
// by the apps via the `@leaksync/ui` → src/index.ts alias; the build emits
// `.d.ts` only. Relative imports use `.ts`/`.tsx` extensions, never `.js`.

// Theme
export * from './theme/index.ts';

// Utils
export { cn } from './utils/cn.ts';

// Primitives
export { AppText } from './primitives/app-text/index.ts';
export type { AppTextVariant, AppTextProps } from './primitives/app-text/index.ts';
export { AppButton } from './primitives/app-button/index.ts';
export type { AppButtonVariant, AppButtonProps } from './primitives/app-button/index.ts';
export { AppStatusDot } from './primitives/app-status-dot/index.ts';
export type { AppStatusKind, AppStatusDotProps } from './primitives/app-status-dot/index.ts';
export { AppPairingCodeDisplay, AppPairingCodeEntry } from './primitives/app-pairing-code/index.ts';
export type {
  AppPairingCodeDisplayProps,
  AppPairingCodeEntryProps,
} from './primitives/app-pairing-code/index.ts';
export { AppItemRow } from './primitives/app-item-row/index.ts';
export type { AppItem, AppItemKind, AppItemRowProps } from './primitives/app-item-row/index.ts';

// Data
export { AppRecentList } from './data/app-recent-list/index.ts';
export type { AppRecentListProps } from './data/app-recent-list/index.ts';
export { AppEmptyState } from './data/app-empty-state/index.ts';
export type { AppEmptyStateProps } from './data/app-empty-state/index.ts';
export { AppSkeletonRow, AppSkeletonList } from './data/app-skeleton-row/index.ts';
export type { AppSkeletonRowProps, AppSkeletonListProps } from './data/app-skeleton-row/index.ts';

// Brand
export { AppLogo, AppIcon, AppTrayIcon } from './brand/app-logo/index.ts';
export type { AppLogoProps, AppIconProps, AppTrayIconProps } from './brand/app-logo/index.ts';

// Overlays — modals, feedback, and the imperative DrawerService
export { AppModal, CriticalModal, CustomModal } from './overlays/app-modal/index.ts';
export type {
  AppModalProps,
  CriticalModalProps,
  CustomModalProps,
  ModalPosition,
} from './overlays/app-modal/index.ts';
export { AppToast, AppBanner } from './overlays/app-feedback/index.ts';
export type { AppToastProps, AppBannerProps, FeedbackTone } from './overlays/app-feedback/index.ts';
export { DrawerService, ToastHost, BannerHost, ModalHost } from './overlays/drawer/index.ts';
export type {
  ToastOptions,
  BannerOptions,
  ConfirmOptions,
  CriticalOptions,
  CustomModalOptions,
  ToastPosition,
  BannerPosition,
} from './overlays/drawer/index.ts';

// Surfaces — composed scenes (the product IS these few scenes)
export { MenuBarPopup } from './surfaces/menu-bar-popup/index.ts';
export type { MenuBarPopupProps } from './surfaces/menu-bar-popup/index.ts';
export {
  PairingDisplayScene,
  PairingEntryScene,
  PairedScene,
} from './surfaces/pairing-scene/index.ts';
export type {
  PairingDisplaySceneProps,
  PairingEntrySceneProps,
  PairedSceneProps,
} from './surfaces/pairing-scene/index.ts';
export { ArrivalNotification } from './surfaces/arrival-notification/index.ts';
export type { ArrivalNotificationProps } from './surfaces/arrival-notification/index.ts';
export { AndroidShareConfirm, AndroidHome } from './surfaces/android-scene/index.ts';
export type {
  AndroidShareConfirmProps,
  AndroidHomeProps,
  AndroidRecentSent,
} from './surfaces/android-scene/index.ts';
export { SettingsScene, AboutScene } from './surfaces/settings-scene/index.ts';
export type {
  SettingsSceneProps,
  SettingsRow,
  AboutSceneProps,
} from './surfaces/settings-scene/index.ts';

// Icons are NOT re-exported here. Import them via the dedicated proxy:
//   import { IconHome } from '@icons';
// This keeps the icon source swappable in one file.
