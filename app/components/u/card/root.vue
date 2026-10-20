<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'

export interface UCardRootProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  variant?: VariantProps<typeof staticBase>['variant']
  spacing?: VariantProps<typeof staticBase>['spacing']
}

const props = defineProps<UCardRootProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn(staticBase({ variant, spacing }), 'flex flex-col', props.class)"
    data-slot="card"
  >
    <slot />
  </Primitive>
</template>
