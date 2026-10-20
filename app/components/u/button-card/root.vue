<script lang="ts">
import type { VariantProps } from 'tailwind-variants'

export const buttonCardVariants = tv({
  base: ['group justify-between items-start gap-2 flex-row flex'],
  defaultVariants: {
    size: 'default',
    variant: 'soft',
  },
  extend: interactiveBase,
  variants: {
    size: {
      default: 'p-4 size-fit',
      lg: 'p-5 size-fit',
      sm: 'p-3 size-fit',
    },
  },
})

export type ButtonCardVariants = VariantProps<typeof buttonCardVariants>
</script>

<script lang="ts" setup>
import type { UButtonProps } from '../button.vue'

export interface UButtonCardRootProps extends Omit<UButtonProps, 'size' | 'variant'> {
  class?: HTMLAttributes['class']
  variant?: ButtonCardVariants['variant']
  size?: ButtonCardVariants['size']
}

const props = withDefaults(defineProps<UButtonCardRootProps>(), {
  as: 'button',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn(buttonCardVariants({ variant, size }), props.class)"
    data-slot="button-card-root"
  >
    <slot />
  </Primitive>
</template>
