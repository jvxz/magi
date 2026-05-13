<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

withDefaults(defineProps<PrimitiveProps>(), {
  as: 'span',
})
</script>

<template>
  <Primitive v-bind="$props" :class="cn('inline text-muted-foreground', $attrs.class)">
    <slot> – </slot>
  </Primitive>
</template>
