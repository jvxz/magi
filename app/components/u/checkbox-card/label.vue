<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ULabel v-bind="delegated" :class="cn('text-foreground w-fit cursor-pointer', $props.class)">
    <slot />
  </ULabel>
</template>
