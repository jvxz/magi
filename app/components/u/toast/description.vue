<script lang="ts" setup>
import type { ToastDescriptionProps } from 'reka-ui'

import type { UAlertDescriptionProps } from '../alert/description.vue'

export type UToastDescriptionProps = ToastDescriptionProps &
  UAlertDescriptionProps & { class?: HTMLAttributes['class'] }

defineProps<UToastDescriptionProps>()
</script>

<template>
  <ToastDescription v-bind="$props" data-slot="toast-title" as-child>
    <UAlertDescription>
      <slot />
    </UAlertDescription>
  </ToastDescription>
</template>
