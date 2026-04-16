<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('flex gap-4 select-text', $attrs.class)">
    <slot />
  </Primitive>
</template>
