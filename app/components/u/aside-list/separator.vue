<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('my-2.5 bg-border shrink-0 h-px w-full', $props.class)">
    <slot />
  </Primitive>
</template>
