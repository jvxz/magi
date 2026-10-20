<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UAlertDialogAnnotationProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UAlertDialogAnnotationProps>(), {
  as: 'p',
})
</script>

<template>
  <UDialogAnnotation v-bind="props">
    <slot />
  </UDialogAnnotation>
</template>
