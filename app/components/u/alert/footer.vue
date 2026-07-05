<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('flex gap-1 items-center justify-end', $props.class)"
    data-slot="alert-footer"
  >
    <slot />
  </Primitive>
</template>
