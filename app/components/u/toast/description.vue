<script lang="ts" setup>
import type { ToastDescriptionProps } from 'reka-ui'

import type { AlertDescriptionProps } from '../alert/description.vue'

defineProps<ToastDescriptionProps & AlertDescriptionProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ToastDescription v-bind="$props" data-slot="toast-title" as-child>
    <UAlertDescription>
      <slot />
    </UAlertDescription>
  </ToastDescription>
</template>
