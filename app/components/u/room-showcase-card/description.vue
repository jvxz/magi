<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('text-xs text-muted-foreground truncate', $attrs.class)">
    <slot />
  </Primitive>
</template>
