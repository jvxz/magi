<script lang="ts" setup>
import type { ToastTitleProps } from 'reka-ui'

import type { AlertTitleProps } from '../alert/alert-title.vue'

const props = defineProps<ToastTitleProps & AlertTitleProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ToastTitle v-bind="delegated" data-slot="toast-title" as-child>
    <UAlertTitle :class="props.class">
      <slot />
    </UAlertTitle>
  </ToastTitle>
</template>
