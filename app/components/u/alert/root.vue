<script lang="ts">
import type { VariantProps } from 'tailwind-variants'

export const alertVariants = tv({
  base: 'relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 py-3 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-1 [&>svg]:text-foreground',
  compoundVariants: [
    {
      class: 'shadow',
      variant: 'default',
    },
    {
      class: 'shadow',
      variant: 'danger',
    },
  ],
  defaultVariants: {
    variant: 'default',
  },
  extend: staticBase,
  variants: {
    variant: {
      danger: 'bg-danger/40 text-danger-foreground',
      ghost: 'bg-transparent',
    },
  },
})

export type AlertVariants = VariantProps<typeof alertVariants>
</script>

<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string; variant?: AlertVariants['variant']; icon?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn(alertVariants({ variant }), 'flex p-4 gap-2', props.class)"
    data-slot="alert-root"
  >
    <slot />
  </Primitive>
</template>
