import { name as pkgName, version as pkgVersion } from './package.json'

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
      service: pkgName,
      version: pkgVersion,
    },
    exclude: [
      '**/_**',
    ],
    include: [
      '**/api/**',
    ],
  },

  experimental: {
    typedPages: true,
    typescriptPlugin: true,
    viteEnvironmentApi: true,
  },

  fonts: {
    defaults: {
      preload: true,
      weights: ['100 900'],
    },
  },

  imports: {
    dirs: [
      '~/app/utils/**/*.ts',
      '~/composables/**/*.ts',
    ],
    presets: [
      { package: 'scule' },
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
    '@compodium/nuxt',
  ],

  nitro: {
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
    preset: 'bun',
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          'data:',
        ],
      },
    },
    rateLimiter: process.env.NODE_ENV === 'production' ? undefined : false,
  },

  site: {
    name: pkgName,
  },
})
