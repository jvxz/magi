import type { NuxtPage } from 'nuxt/schema'

import { pwa } from './app/config/pwa'
import { COLOR_MODE__DEFAULT } from './app/constants/color-mode'

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        style: 'background-color: var(--color-background);',
      },
      titleTemplate: 'Magi',
    },
  },

  colorMode: {
    fallback: COLOR_MODE__DEFAULT,
    preference: COLOR_MODE__DEFAULT,
    storage: 'cookie',
    storageKey: 'theme',
  },

  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/globals.css', '~/assets/css/transitions.css', '~/assets/css/highlight.css'],

  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  experimental: {
    typedPages: true,
    typescriptPlugin: true,
  },

  fonts: {
    defaults: {
      preload: true,
      weights: ['100 900'],
    },
  },

  future: {
    compatibilityVersion: 5,
  },

  hooks: {
    'pages:extend': pages => {
      function requireAuth(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page?.path.startsWith('/app')) {
            page.meta ||= {}
            page.meta.requiresAuth = true
          }
          if (page.children) requireAuth(page.children)
        }
      }
      requireAuth(pages)
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
      },
    ],
    parallelPlugin: true,
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },

  icon: {
    clientBundle: {
      // only scan icon constants
      scan: { globInclude: ['**/*.{vue,jsx,tsx,md,mdc,mdx,yml,yaml}', 'app/constants/icon.ts'] },
    },
    collections: ['tabler', 'custom'],
    customCollections: [{ dir: './app/assets/icons', prefix: 'custom', provider: 'none' }],
  },

  imports: {
    dirs: ['~/utils/**/*.ts', '~/config/**/*.ts', '~/composables/**/*.ts', '~/constants/**/*.ts'],
    presets: [
      { ignore: ['isEqual'], package: 'es-toolkit' },
      { package: 'ufo' },
      { package: 'tailwind-variants' },
      { package: 'tailwind-merge' },
      {
        from: 'valibot',
        imports: [{ as: 'v', name: '*' }],
      },
      {
        from: 'temporal-polyfill',
        imports: ['Temporal'],
      },
      {
        from: '@tanstack/vue-query',
        imports: ['useMutation', 'useQueryClient'],
      },
    ],
  },

  modules: [
    '~/modules/palettes',
    '~/modules/vitalizer',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@unocss/nuxt',
    'nuxt-security',
    '@vueuse/nuxt',
    'reka-ui/nuxt',
    '@nuxtjs/color-mode',
    '@regle/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
    'motion-v/nuxt',
    'nuxt-twemoji',
    'nuxt-tiptap-editor',
    '@nuxtjs/i18n',
    '@nuxt/scripts',
  ],

  pwa,

  routeRules: {
    '/_nuxt/**': {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    '/app': { appMiddleware: 'home-redirect' },
    '/app/me': { appMiddleware: 'home-redirect' },
    '/playground': { appLayout: false },
  },

  runtimeConfig: {
    public: {
      showLoadTime: false,
    },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': false,
        'script-src': import.meta.dev
          ? false
          : ["'self'", 'https:', "'unsafe-inline'", "'strict-dynamic'", "'nonce-{{nonce}}'", "'wasm-unsafe-eval'"],
      },
    },
    rateLimiter: false,
    removeLoggers: false,
    sri: false,
  },

  ssr: false,

  typescript: {
    nodeTsConfig: {
      include: ['../test/e2e/**/*'],
    },
    tsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
        // vue-router support for golar
        rootDir: '..',
        types: ['grecaptcha'],
      },
      include: ['../test/browser/**/*'],
    },
  },

  vite: {
    build: {
      // microlighter lazy loads grammars via dynamic import in node modules
      dynamicImportVarsOptions: { exclude: [] },
    },
    optimizeDeps: {
      exclude: ['microlighter', 'microlighter/microlighter.min.js'],
      include: [
        '@regle/core',
        '@regle/rules',
        '@tanstack/vue-hotkeys',
        '@tanstack/vue-query',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'es-toolkit',
        'es-toolkit/map',
        'es-toolkit/string',
        'matrix-js-sdk',
        'mime/lite',
        'quick-lru',
        'tailwind-variants',
        'temporal-polyfill',
        'workbox-window',
        'matrix-js-sdk/lib/indexeddb-worker',
        '@tanstack/query-persist-client-core',
        '@tanstack/vue-virtual',
        '@tiptap/extension-emoji',
        '@tiptap/extension-mention',
        '@tiptap/extension-placeholder',
        '@tiptap/pm/model',
        '@tiptap/pm/state',
        'dompurify',
        'es-toolkit/set',
        'marked',
        'virtua/vue',
        '@faker-js/faker',
      ],
    },
    worker: {
      format: 'es',
    },
  },
})
