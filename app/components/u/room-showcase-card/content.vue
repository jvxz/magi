<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('flex flex-col w-full justify-around tabular-nums', $attrs.class)">
    <slot />
  </Primitive>
</template>
