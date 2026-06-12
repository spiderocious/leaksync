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
    // Externalize node_modules deps, but BUNDLE the workspace packages — their
    // source uses NodeNext '.js' import specifiers that Electron's runtime Node
    // loader can't resolve against the '.ts' files. Bundling lets vite resolve
    // them at build time.
    plugins: [externalizeDepsPlugin({ exclude: ['@leaksync/core', '@leaksync/api', '@leaksync/ui'] })],
    resolve: { alias: { '@leaksync/core': pkg('core/src/index.ts') } },
    build: {
      // Electron's main process loads `electron` as CommonJS. Emit CJS (.cjs) so
      // named imports from electron work, even though package.json is ESM.
      rollupOptions: {
        input: { index: path.resolve(dirname, 'src/main/index.ts') },
        output: { format: 'cjs', entryFileNames: '[name].cjs' },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ['@leaksync/core', '@leaksync/api', '@leaksync/ui'] })],
    resolve: { alias: { '@leaksync/core': pkg('core/src/index.ts') } },
    build: {
      rollupOptions: {
        input: { index: path.resolve(dirname, 'src/preload/index.ts') },
        output: { format: 'cjs', entryFileNames: '[name].cjs' },
      },
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
