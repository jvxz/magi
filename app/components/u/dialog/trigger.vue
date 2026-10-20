<script setup lang="ts">
import type { DialogTriggerProps } from 'reka-ui'

import { DialogTrigger } from 'reka-ui'

export type UDialogTriggerProps = DialogTriggerProps

const props = defineProps<UDialogTriggerProps>()
</script>

<template>
  <DialogTrigger v-bind="props">
    <slot />
  </DialogTrigger>
</template>
