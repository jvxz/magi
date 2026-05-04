<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('flex flex-col p-3.5', $attrs.class)">
    <slot />
  </Primitive>
</template>
