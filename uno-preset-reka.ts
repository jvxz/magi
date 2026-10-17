import type { Variant } from 'unocss'

import { definePreset } from 'unocss'

const REKA_ATTRS: Record<string, string> = {
  active: ':is([data-active],[data-state=on])',
  checked: '[data-state=checked]',
  closed: '[data-state=closed]',
  'delayed-open': '[data-state=delayed-open]',
  disabled: '[data-disabled]',
  hidden: '[data-state=hidden]',
  highlighted: '[data-highlighted]',
  horizontal: '[data-orientation=horizontal]',
  inactive: '[data-state=inactive]',
  indeterminate: '[data-state=indeterminate]',
  'instant-open': '[data-state=instant-open]',
  invalid: '[data-invalid]',
  off: '[data-state=off]',
  on: '[data-state=on]',
  open: '[data-state=open]',
  placeholder: '[data-placeholder]',
  readonly: '[data-readonly]',
  selected: '[data-selected]',
  'side-bottom': '[data-side=bottom]',
  'side-left': '[data-side=left]',
  'side-right': '[data-side=right]',
  'side-top': '[data-side=top]',
  unchecked: '[data-state=unchecked]',
  vertical: '[data-orientation=vertical]',
  visible: '[data-state=visible]',
}

const REKA_RE = /^(not-|group-|group-hover-not-)?reka-([\w-]+):(.+)$/
const variantReka: Variant = {
  match(matcher) {
    const [, mod, key = '', rest = ''] = matcher.match(REKA_RE) ?? []
    const attr = REKA_ATTRS[key]
    if (!attr) return undefined
    const selectors: Record<string, (s: string) => string> = {
      '': s => `${s}${attr}`,
      'group-': s => `:where(.group)${attr} ${s}`,
      'group-hover-not-': s => `.group:hover:not(${attr}) ${s}`,
      'not-': s => `${s}:not(${attr})`,
    }
    return { matcher: rest, selector: selectors[mod ?? ''] }
  },
  multiPass: true,
  name: 'reka',
}

export const presetReka = definePreset(() => ({
  name: 'reka',
  variants: [variantReka],
}))
