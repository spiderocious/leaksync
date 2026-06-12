import { Show } from 'meemaw';
import { Link } from 'react-router-dom';

import { useHealth } from '@leaksync/api';
import { ROUTES } from '@leaksync/core';
import { AppButton, AppText } from '@leaksync/ui';

export function HomeScreen() {
  const { data, isLoading, isError } = useHealth();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <AppText variant="caption">leaksync</AppText>
      <AppText variant="display-1" className="mt-2 text-brand-900">
        LeakSync
      </AppText>
      <AppText variant="body" className="mt-4 max-w-2xl text-ink-700">
        Share anything from your phone to your Mac, instantly. This web surface is
        the workspace home — the product lives in the desktop and mobile apps.
      </AppText>

      <div className="mt-8 flex gap-3">
        <Link to={ROUTES.PREVIEW}>
          <AppButton>Open design preview</AppButton>
        </Link>
      </div>

      <section className="mt-12 rounded-lg border border-brand-900/10 bg-white/60 p-4 text-sm">
        <AppText variant="caption">backend health</AppText>
        <div className="mt-2">
          <Show when={isLoading}>Checking…</Show>
          <Show when={isError}>
            <span className="text-accent-600">unreachable — is main-backend running?</span>
          </Show>
          <Show when={!!data}>
            <span>
              status: <strong>{data?.status}</strong>
            </span>
          </Show>
        </div>
      </section>
    </main>
  );
}
