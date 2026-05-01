import { defineConfig, definePreset, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetAnimations } from 'unocss-preset-animations'

const presetAnchorPositioning = definePreset(() => {
  return {
    name: 'unocss-anchor-positioning-preset',
    rules: [
      [
        /(?<=position-anchor-)(?<name>[a-zA-Z0-9]+)/g,
        ([name]) => ({
          'position-anchor': `--${name}`,
        }),
      ],
      [
        /(?<=anchor-name-)(?<name>[a-zA-Z0-9]+)/g,
        ([name]) => ({
          'anchor-name': `--${name}`,
        }),
      ],
      [
        /(?<=anchor-)(?<pos>left|right|top|bottom|inset)/g,
        ([pos]) => {
          if (pos === 'inset') {
            return {
              bottom: 'anchor(bottom)',
              left: 'anchor(left)',
              right: 'anchor(right)',
              top: 'anchor(top)',
            }
          }
          return {
            [pos]: `anchor(${pos})`,
          }
        },
      ],
    ],
  }
})

export default defineConfig({
  presets: [
    presetWind4({
      preflights: { reset: false },
    }),
    presetAnimations,
    presetAnchorPositioning,
  ],
  rules: [
    [
      'scrollbar-gutter-stable',
      {
        'scrollbar-gutter': 'stable',
      },
    ],
    [
      'text-clip',
      {
        'text-box': 'trim-both cap alphabetic',
      },
    ],
    [
      'ease-snappy',
      {
        'transition-timing-function': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
    ],
  ],
  safelist: ['group'],
  shortcuts: [
    {
      squish: 'motion-safe:active:scale-96.5 duration-100 ease-out',
    },
    {
      'resize-handle': 'bg-muted-foreground opacity-75 h-full w-1.5 pointer-events-none transition-all duration-75 delay-150 ease-in-out inset-0 absolute z-10 z-100 group-data-[state=inactive]:opacity-0 group-data-[state=inactive]:w-0.5 -translate-x-1/2 group-data-[state=inactive]:delay-0',
    },
  ],
  theme: {
    colors: {
      'accent': 'var(--accent)',
      'accent-foreground': 'var(--accent-foreground)',
      'background': 'var(--background)',
      'border': 'var(--border)',
      'card': 'var(--card)',
      'card-dark': 'var(--card-dark)',
      'card-darker': 'var(--card-darker)',
      'card-foreground': 'var(--card-foreground)',
      'card-light': 'var(--card-light)',
      'card-lighter': 'var(--card-lighter)',
      'danger': 'var(--danger)',
      'danger-foreground': 'var(--danger-foreground)',
      'foreground': 'var(--foreground)',
      'input': 'var(--input)',
      'muted': 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
      'overlay': 'var(--overlay)',
      'popover': 'var(--popover)',
      'popover-foreground': 'var(--popover-foreground)',
      'primary': 'var(--primary)',
      'primary-foreground': 'var(--primary-foreground)',
      'ring': 'var(--ring)',
      'secondary': 'var(--secondary)',
      'secondary-foreground': 'var(--secondary-foreground)',
    },
    duration: {
      DEFAULT: '92.5ms',
      long: '150ms',
    },
    font: {
      mono: 'Paper Mono',
      sans: 'Inter',
    },
    fontWeight: {
      medium: '550',
      normal: '425',
    },
    radius: {
      DEFAULT: 'var(--radius)',
    },
    spacing: {
      'app-header-height': '2rem',
      'header-height': '49px',
      'page-y-padding': '6rem',
      'user-card-height': '3.625rem',
    },
    text: {
      '2xs': {
        fontSize: '0.7rem',
        lineHeight: '0.875rem',
      },
    },
  },
  transformers: [transformerVariantGroup(), transformerDirectives({ throwOnMissing: false })],
})
