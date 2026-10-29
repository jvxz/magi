<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDialogRootProps = DialogRootProps
export type UDialogRootEmits = DialogRootEmits

const props = defineProps<UDialogRootProps>()
const emits = defineEmits<UDialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-slot="slotProps" v-bind="forwarded" data-slot="dialog-root">
    <slot v-bind="slotProps" />
  </DialogRoot>
</template>
