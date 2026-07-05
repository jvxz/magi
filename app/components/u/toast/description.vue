<script lang="ts" setup>
import type { ToastDescriptionProps } from 'reka-ui'

import type { AlertDescriptionProps } from '../alert/alert-description.vue'

defineProps<ToastDescriptionProps & AlertDescriptionProps & { class?: string }>()
</script>

<template>
  <ToastDescription v-bind="$props" data-slot="toast-title" as-child>
    <UAlertDescription>
      <slot />
    </UAlertDescription>
  </ToastDescription>
</template>
