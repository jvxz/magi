<script lang="ts">
import type { AlertDialogEmits, AlertDialogProps } from 'reka-ui'

import { createContext, useForwardPropsEmits } from 'reka-ui'

export const [injectAlertDialogPreventClose, provideAlertDialogPreventClose] = createContext<{
  preventClose: Ref<boolean>
}>('UAlertDialogRoot')
</script>

<script setup lang="ts">
export type UAlertDialogRootProps = AlertDialogProps & { preventClose?: boolean }
export type UAlertDialogRootEmits = AlertDialogEmits

const props = defineProps<UAlertDialogRootProps>()
const emits = defineEmits<UAlertDialogRootEmits>()

const preventClose = toRef(props, 'preventClose')
provideAlertDialogPreventClose({ preventClose: computed(() => !!preventClose?.value) })

const delegated = reactiveOmit(props, 'preventClose')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <AlertDialogRoot v-bind="forwarded">
    <slot />
  </AlertDialogRoot>
</template>
