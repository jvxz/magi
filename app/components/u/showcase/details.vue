<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('text-sm flex gap-2 items-center tabular-nums *:flex *:gap-1 *:items-center', $props.class)"
  >
    <slot />
  </Primitive>
</template>
