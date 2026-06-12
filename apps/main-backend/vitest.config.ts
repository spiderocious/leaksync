import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    // Mirror the tsconfig path aliases so tests import like source does.
    alias: {
      '@features': resolve(root, 'src/features'),
      '@lib': resolve(root, 'src/lib'),
      '@middlewares': resolve(root, 'src/middlewares'),
      '@shared': resolve(root, 'src/shared'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Contract tests share one Mongo + one app; run serially to avoid
    // cross-test interference on the shared test database.
    fileParallelism: false,
    setupFiles: ['src/test/setup.ts'],
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});
