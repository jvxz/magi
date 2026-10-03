import { setup } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'

// oxlint-disable-next-line antfu/no-top-level-await
await setup({
  browser: true,
  build: false,
  nuxtConfig: { nitro: { output: { dir: fileURLToPath(new URL('../../.output', import.meta.url)) } } },
  rootDir: fileURLToPath(new URL('../..', import.meta.url)),
})
