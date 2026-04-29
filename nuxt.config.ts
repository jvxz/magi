import type { NuxtPage } from 'nuxt/schema'
import { uniq } from 'es-toolkit/array'
import { pwa } from './app/config/pwa'
import { appMeta } from './shared/utils/constants'

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        style: 'background-color: var(--color-background);',
      },
      titleTemplate: '%siteName',
    },
  },

  colorMode: {
    storage: 'cookie',
  },

  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/globals.css'],

  devtools: { enabled: true },

  eslint: {
    config: {
      import: false,
      standalone: false,
    },
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
    typescriptPlugin: true,
  },

  fonts: {
    defaults: {
      preload: true,
      weights: ['100 900'],
    },
  },

  hooks: {
    'pages:extend': (pages) => {
      function requireAuth(pages: NuxtPage[]) {
        for (const page of pages) {
          if (page?.path.startsWith('/app')) {
            page.meta ||= {}
            page.meta.requiresAuth = true

            if (!page.meta.middleware)
              page.meta.middleware = ['auth']

            else {
              if (Array.isArray(page.meta.middleware))
                page.meta.middleware = uniq([...page.meta.middleware, 'auth'])

              else
                page.meta.middleware = uniq([page.meta.middleware, 'auth'])
            }
          }
          if (page.children)
            requireAuth(page.children)
        }
      }
      requireAuth(pages)
    },
  },

  icon: {
    clientBundle: {
      scan: true,
    },
    customCollections: [{ dir: './app/assets/icons', prefix: 'custom', provider: 'none' }],
  },

  imports: {
    dirs: [
      '~/utils/**/*.ts',
      '~/config/**/*.ts',
      '~/composables/**/*.ts',
      '~/constants/**/*.ts',
      './shared/**/*.ts',
    ],
    presets: [
      { ignore: ['isEqual'], package: 'es-toolkit' },
      { package: 'ufo' },
      {
        from: 'zod',
        imports: [{ as: 'z', name: '*' }],
      },
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@unocss/nuxt',
    'nuxt-security',
    '@vueuse/nuxt',
    'reka-ui/nuxt',
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    'nuxt-vitalizer',
    '@regle/nuxt',
    '@nuxt/hints',
    '@vite-pwa/nuxt',
    '@nuxt/test-utils/module',
    '@peterbud/nuxt-query',
    'motion-v/nuxt',
  ],

  nitro: {
    cloudflare: {
      nodeCompat: true,
    },

    imports: {
      dirs: [
        './server/schema/*',
        './server/utils/*',
      ],
      presets: [
        {
          from: 'zod',
          imports: ['z'],
        },
      ],
    },
  },

  nuxtQuery: {
    autoImports: ['useMutation', 'useQueryClient'],
    devtools: true,
    queryClientOptions: {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: true,
          // 1 hour
          staleTime: 1000 * 60 * 60,
        },
      },
    },
  },

  pwa,

  routeRules: {
    '/app/**': { ssr: false },
    '/login': { ssr: false },
    '/playground': { appLayout: false },
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': false,
        'script-src': import.meta.dev
          ? false
          : [
              '\'self\'',
              'https:',
              '\'unsafe-inline\'',
              '\'strict-dynamic\'',
              '\'nonce-{{nonce}}\'',
              '\'wasm-unsafe-eval\'',
            ],
      },
    },
    rateLimiter: false,
    sri: false,
  },

  site: {
    name: appMeta.name,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
      },
    },
  },

  vite: {
    optimizeDeps: {
      exclude: [
        '@matrix-org/matrix-sdk-crypto-wasm',
        'workbox-core',
        'workbox-expiration',
        'workbox-precaching',
        'workbox-strategies',
        'zod',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'workbox-window',
        'es-toolkit',
      ],
      include: [
        'matrix-js-sdk',
      ],
    },
  },
})
