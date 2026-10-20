<script lang="ts">
import type { VariantProps } from 'tailwind-variants'

export const toggleVariants = tv({
  base: 'p-0 data-[state=off]:(hover:text-foreground hover:bg-hover) data-[state=on]:(bg-selected hover:bg-selected text-foreground)',
  defaultVariants: {
    size: 'default',
    variant: 'ghost',
  },
  extend: interactiveBase,
  variants: {
    variant: {
      ghost: interactiveBase({ variant: 'ghost' }),
      outline: interactiveBase({
        class: 'data-[state=on]:(border-border-strong)',
        variant: 'outline',
      }),
    },
  },
})

export type ToggleVariants = VariantProps<typeof toggleVariants>
</script>

<script setup lang="ts">
import type { ToggleEmits, ToggleProps } from 'reka-ui'

import { Toggle, useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(
  defineProps<
    ToggleProps & {
      class?: HTMLAttributes['class']
      variant?: ToggleVariants['variant']
      size?: ToggleVariants['size']
    }
  >(),
  {
    disabled: false,
    size: 'default',
    variant: 'ghost',
  },
)

const emits = defineEmits<ToggleEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <Toggle
    v-slot="slotProps"
    data-slot="toggle"
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot v-bind="slotProps" />
  </Toggle>
</template>
