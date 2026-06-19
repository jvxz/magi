<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4', $props.class)"
    data-slot="dialog-footer"
  >
    <slot />
  </Primitive>
</template>
