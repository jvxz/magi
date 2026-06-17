<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('flex-1  ', $attrs.class)">
    <div v-if="$slots.header" class="text-sm font-medium flex gap-2 items-center">
      <slot name="header" />
    </div>
    <slot />
  </Primitive>
</template>
