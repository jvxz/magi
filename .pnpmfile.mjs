const BRIDGE = 'npm:typescript-native-bridge@6.0.3-bridge.19.tsgo.7.0.2'

const needsBridge = name =>
  name.startsWith('@typescript-eslint/') || name === 'ts-api-utils' || name === 'eslint-plugin-n'

function readPackage(pkg) {
  if (needsBridge(pkg.name) && (pkg.peerDependencies?.typescript || pkg.dependencies?.typescript)) {
    delete pkg.peerDependencies?.typescript
    pkg.dependencies = { ...pkg.dependencies, typescript: BRIDGE }
  }
  return pkg
}

export const hooks = { readPackage }
