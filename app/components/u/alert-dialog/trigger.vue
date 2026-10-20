<script setup lang="ts">
import type { AlertDialogTriggerProps } from 'reka-ui'

import { AlertDialogTrigger } from 'reka-ui'

export type UAlertDialogTriggerProps = AlertDialogTriggerProps

const props = defineProps<UAlertDialogTriggerProps>()
</script>

<template>
  <AlertDialogTrigger v-bind="props">
    <slot />
  </AlertDialogTrigger>
</template>
