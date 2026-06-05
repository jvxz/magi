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
    [
      /^(bg|text|border)-(.+)-(hover|press)$/,
      ([, prop, name, state], { theme }) => {
        const color = (theme.colors as Record<string, string>)[name]
        if (typeof color !== 'string') return
        const cssProp = prop === 'bg' ? 'background-color' : prop === 'text' ? 'color' : 'border-color'
        return { [cssProp]: `oklch(from ${color} calc(l + var(--shift-${state})) c h)` }
      },
    ],
  ],
  safelist: ['group'],
  shortcuts: [
    {
      squish: 'motion-safe:active:scale-96.5 duration-100 ease-out',
    },
    {
      'resize-handle':
        'bg-muted-foreground opacity-75 h-full w-1.5 pointer-events-none transition-all duration-75 delay-150 ease-in-out inset-0 absolute z-10 z-100 group-data-[state=inactive]:opacity-0 group-data-[state=inactive]:w-0.5 -translate-x-1/2 group-data-[state=inactive]:delay-0',
    },
    {
      'z-dialog': 'z-50',
      'z-menu': 'z-70',
      'z-overlay': 'z-50',
      'z-popover': 'z-60',
      'z-tooltip': 'z-80',
    },
  ],
  theme: {
    colors: {
      accent: 'var(--accent)',
      'accent-foreground': 'var(--accent-foreground)',
      background: 'var(--background)',
      border: 'var(--border)',
      'border-strong': 'var(--border-strong)',
      danger: 'var(--danger)',
      'danger-foreground': 'var(--danger-foreground)',
      foreground: 'var(--foreground)',
      hover: 'var(--hover)',
      input: 'var(--input)',
      muted: 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
      overlay: 'var(--overlay)',
      popover: 'var(--popover)',
      'popover-foreground': 'var(--popover-foreground)',
      primary: 'var(--primary)',
      'primary-foreground': 'var(--primary-foreground)',
      ring: 'var(--ring)',
      secondary: 'var(--secondary)',
      'secondary-foreground': 'var(--secondary-foreground)',
      'secondary-raised': 'var(--secondary-raised)',
      selected: 'var(--selected)',
      surface: 'var(--surface)',
      'surface-foreground': 'var(--surface-foreground)',
      'surface-raised': 'var(--surface-raised)',
    },
    duration: {
      DEFAULT: '92.5ms',
      long: '150ms',
    },
    font: {
      mono: 'Paper Mono',
      sans: 'Pretendard',
    },
    fontWeight: {
      // medium: '500',
      // normal: '425',
    },
    radius: {
      DEFAULT: 'var(--radius)',
    },
    shadow: {
      DEFAULT: [`0 1px 3px 0 #00000035`, `0 1px 2px -1px #00000035`],
      lg: [`0 10px 15px -3px #00000035`, `0 4px 6px -4px #00000035`],
      md: [`0 4px 6px -1px #00000035`, `0 2px 4px -2px #00000035`],
      sm: [`0 1px 3px 0 #00000035`, `0 1px 2px -1px #00000035`],
      xl: [`0 20px 25px -5px #00000035`, `0 8px 10px -6px #00000035`],
    },
    spacing: {
      'app-header-height': '2rem',
      'generic-page-max-width': '72rem',
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
