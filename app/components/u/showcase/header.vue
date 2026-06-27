<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex flex-col gap-4', $props.class)">
    <slot />
  </Primitive>
</template>
