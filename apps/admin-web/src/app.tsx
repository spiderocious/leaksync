import { AppProviders } from './app.provider';
import { AppRoutes } from './app.routes';

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
