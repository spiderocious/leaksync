import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '@leaksync/core';

import { HomeScreen } from '@features/health/home-screen.tsx';

// Dev-only design-system gallery — lazy so it stays out of the main bundle.
const PreviewScreen = lazy(() =>
  import('@features/preview/screen/preview-screen.tsx').then((m) => ({ default: m.PreviewScreen })),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomeScreen />} />
      <Route
        path={ROUTES.PREVIEW}
        element={
          <Suspense fallback={null}>
            <PreviewScreen />
          </Suspense>
        }
      />
      <Route path="*" element={<HomeScreen />} />
    </Routes>
  );
}
