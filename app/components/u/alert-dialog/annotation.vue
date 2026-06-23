<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { class?: string }>(), {
  as: 'p',
})
</script>

<template>
  <UDialogAnnotation v-bind="props">
    <slot />
  </UDialogAnnotation>
</template>
