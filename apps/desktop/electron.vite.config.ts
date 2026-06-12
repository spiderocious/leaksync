import { fileURLToPath } from 'node:url';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = (p: string) => path.resolve(dirname, '../../packages', p);

// Aliases so the renderer consumes the shared packages from source (mirrors the
// web app's vite config). The main/preload are Node and externalize deps.
const sharedAlias = {
  '@leaksync/ui/styles.css': pkg('ui/src/styles.css'),
  '@leaksync/ui': pkg('ui/src/index.ts'),
  '@leaksync/core': pkg('core/src/index.ts'),
  '@leaksync/api': pkg('api/src/index.ts'),
  '@icons': pkg('ui/src/icons/index.ts'),
  '@app': path.resolve(dirname, 'src/renderer/src'),
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: { '@leaksync/core': pkg('core/src/index.ts') } },
    build: {
      rollupOptions: { input: { index: path.resolve(dirname, 'src/main/index.ts') } },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: { input: { index: path.resolve(dirname, 'src/preload/index.ts') } },
    },
  },
  renderer: {
    root: path.resolve(dirname, 'src/renderer'),
    resolve: { alias: sharedAlias },
    plugins: [react()],
    build: {
      rollupOptions: { input: { index: path.resolve(dirname, 'src/renderer/index.html') } },
    },
  },
});
