<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDialogRootProps = DialogRootProps & { preventClose?: boolean }
export type UDialogRootEmits = DialogRootEmits

const props = defineProps<UDialogRootProps>()
const emits = defineEmits<UDialogRootEmits>()

const delegated = reactiveOmit(props, 'preventClose')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DialogRoot
    v-slot="slotProps"
    v-bind="forwarded"
    data-slot="dialog-root"
    @before-update:open="(value, details) => !value && preventClose && details.cancel()"
  >
    <slot v-bind="slotProps" />
  </DialogRoot>
</template>
