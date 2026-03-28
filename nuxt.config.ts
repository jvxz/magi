import { pwa } from './app/config/pwa'
import { version } from './package.json'
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

  evlog: {
    env: {
      service: appMeta.name,
      version,
    },
    exclude: [
      '**/_**',
    ],
    include: [
      '**/api/**',
    ],
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

  icon: {
    provider: 'server',
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
      {
        from: 'evlog',
        imports: ['createError'],
        priority: 2,
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
    'evlog/nuxt',
    '@nuxtjs/device',
    '@regle/nuxt',
    '@nuxt/hints',
    'nitro-cloudflare-dev',
    '@vite-pwa/nuxt',
    '@unlazy/nuxt',
  ],

  nitro: {
    cloudflare: {
      deployConfig: true,
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

    preset: 'cloudflare_module',
  },

  pwa,

  routeRules: {
    '/app/**': { appMiddleware: 'auth', ssr: false },
    '/login': { appMiddleware: 'auth', ssr: false },
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
    rateLimiter: import.meta.dev ? false : undefined,
    sri: false,
  },

  site: {
    name: appMeta.name,
  },

  vite: {
    optimizeDeps: {
      exclude: [
        '@matrix-org/matrix-sdk-crypto-wasm',
      ],
    },
  },
})
