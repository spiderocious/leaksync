import { BannerHost, ModalHost, ToastHost } from '@leaksync/ui';

import { AppProviders } from './app.provider';
import { AppRoutes } from './app.routes';

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
      {/* Imperative overlay hosts — mounted once, driven by DrawerService. */}
      <ToastHost />
      <BannerHost />
      <ModalHost />
    </AppProviders>
  );
}
