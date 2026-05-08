<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & {
  class?: string
  variant?: keyof typeof staticStyles.variant
}>(), {
  variant: 'default',
})
</script>

<template>
  <Primitive
    v-bind="$props"
    data-slot="card"
    :class="cn(
      staticStyles.base,
      staticStyles.variant[variant],
      'flex flex-col gap-5 shadow-lg',
      props.class,
    )"
  >
    <slot />
  </Primitive>
</template>
