<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="
      cn('border-b bg-surface shrink-0 h-header-height w-full top-0 sticky z-20 px-4 flex items-center', $props.class)
    "
  >
    <slot />
  </Primitive>
</template>
