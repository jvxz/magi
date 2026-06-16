<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('flex gap-2 max-h-1em items-center', $attrs.class)">
    <slot />
  </Primitive>
</template>
