<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('flex flex-1 flex-col', $attrs.class)">
    <div v-if="$slots.header" class="space-x-2 font-medium text-sm">
      <slot name="header" />
    </div>
    <slot />
  </Primitive>
</template>
