<script lang="ts">
const cardGroupItemVariants = tv({
  base: [staticBase(), 'rounded-none border-0 relative isolate text-left'],
  defaultVariants: {
    spacing: 'default',
  },
  variants: {
    spacing: {
      default: 'data-[interactive]:(rounded-sm p-2 m-2) p-4',
      lg: 'data-[interactive]:(rounded-sm p-2 m-3) p-5',
    },
    variant: {
      raised:
        'bg-surface-raised data-[interactive]:(cursor-pointer hover:bg-surface-raised-hover active:bg-surface-raised-press) reka-open:(bg-surface-raised-press)',
    },
  },
})
export type CardGroupItemVariants = VariantProps<typeof cardGroupItemVariants>
</script>

<script lang="ts" setup>
import type { VariantProps } from 'tailwind-variants'

import type { UCardRootProps } from '../card/root.vue'

export interface UCardGroupItemProps extends UCardRootProps {
  variant?: CardGroupItemVariants['variant']
  interactive?: boolean
  spacing?: CardGroupItemVariants['spacing']
}

const props = defineProps<UCardGroupItemProps>()

const delegated = reactiveOmit(props, ['class', 'as'])

const as = computed(() => (props.as ? props.as : props.interactive ? 'button' : undefined))
</script>

<template>
  <UCardRoot
    v-bind="delegated"
    :as
    :data-interactive="interactive ? '' : undefined"
    :class="cn(cardGroupItemVariants({ variant, spacing }), props.class)"
    data-slot="card-group-item"
  >
    <slot />
  </UCardRoot>
</template>
