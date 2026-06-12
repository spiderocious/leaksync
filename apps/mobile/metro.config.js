// Metro config tuned for this pnpm monorepo. Expo's default resolver only walks
// the app's own node_modules; in a workspace, shared packages (@leaksync/core)
// and hoisted deps live at the repo root, so we add both roots to the watch +
// resolution paths. See https://docs.expo.dev/guides/monorepos/.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole workspace so changes in packages/* trigger reloads.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both the app and the workspace root (pnpm hoists
//    some deps to the root .pnpm store / node_modules).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. pnpm uses symlinks heavily — let Metro follow them.
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
