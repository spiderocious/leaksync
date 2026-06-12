import { Show } from 'meemaw';
import { Link } from 'react-router-dom';

import { useHealth } from '@leaksync/api';
import { ROUTES } from '@leaksync/core';
import { AppButton, AppText } from '@leaksync/ui';

export function HomeScreen() {
  const { data, isLoading, isError } = useHealth();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <AppText variant="overline">leaksync</AppText>
      <AppText variant="display" as="h1" className="mt-2 !tracking-[-0.02em] !text-[44px]">
        LeakSync
      </AppText>
      <AppText variant="read" className="mt-4 max-w-2xl text-ink-2">
        Share anything from your phone to your Mac, instantly. This web surface is
        the workspace home — the product lives in the desktop and mobile apps.
      </AppText>

      <div className="mt-8 flex gap-3">
        <Link to={ROUTES.PREVIEW}>
          <AppButton>Open design preview</AppButton>
        </Link>
      </div>

      <section className="mt-12 rounded-card border border-hair bg-paper-sheet p-4 text-sm">
        <AppText variant="overline">backend health</AppText>
        <div className="mt-2">
          <Show when={isLoading}>Checking…</Show>
          <Show when={isError}>
            <span className="text-warn">unreachable — is main-backend running?</span>
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
