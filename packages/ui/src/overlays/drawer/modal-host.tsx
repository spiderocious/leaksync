import { useSyncExternalStore } from 'react';

import { AppModal, CriticalModal, CustomModal } from '../app-modal/app-modal.tsx';
import { drawerStore, type ModalEntry } from './drawer-store.ts';

// ModalHost — mounts once at the app root. Renders the one open modal, driven by
// DrawerService.confirm / .critical / .openModal. The hosted modals handle their
// own createPortal.
export function ModalHost() {
  const state = useSyncExternalStore(drawerStore.subscribe, drawerStore.getState);
  const m = state.modal;
  if (m === null) return null;

  const handleClose = () => {
    if (m.onCancel !== undefined) {
      m.onCancel();
    } else {
      drawerStore.closeModal();
    }
  };

  const shared = pickShared(m);

  if (m.kind === 'custom') {
    return (
      <CustomModal open onClose={handleClose} hideCloseButton={m.hideCloseButton} {...shared}>
        {m.body}
      </CustomModal>
    );
  }

  if (m.kind === 'critical') {
    return (
      <CriticalModal
        open
        onClose={handleClose}
        onConfirm={m.onConfirm}
        title={m.title}
        {...(m.description !== undefined ? { description: m.description } : {})}
        confirmPhrase={m.confirmPhrase}
        confirmPrompt={m.confirmPrompt}
        confirmLabel={m.confirmLabel}
        {...(m.cancelLabel !== undefined ? { cancelLabel: m.cancelLabel } : {})}
        {...shared}
      >
        {m.children}
      </CriticalModal>
    );
  }

  return (
    <AppModal
      open
      onClose={handleClose}
      onConfirm={m.onConfirm}
      title={m.title}
      {...(m.description !== undefined ? { description: m.description } : {})}
      intent={m.kind === 'danger' ? 'danger' : 'standard'}
      confirmLabel={m.confirmLabel}
      {...(m.cancelLabel !== undefined ? { cancelLabel: m.cancelLabel } : {})}
      {...shared}
    >
      {m.children}
    </AppModal>
  );
}

function pickShared(m: ModalEntry) {
  return {
    position: m.position,
    closeOnOutsideClick: m.closeOnOutsideClick,
    closeOnEscape: m.closeOnEscape,
    sticky: m.sticky,
  };
}
