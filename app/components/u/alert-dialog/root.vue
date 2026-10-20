<script lang="ts">
import type { AlertDialogEmits, AlertDialogProps } from 'reka-ui'

import { createContext, useForwardPropsEmits } from 'reka-ui'

export const [injectAlertDialogPreventClose, provideAlertDialogPreventClose] = createContext<{
  preventClose: Ref<boolean>
}>('UAlertDialogRoot')
</script>

<script setup lang="ts">
const props = defineProps<AlertDialogProps & { preventClose?: boolean }>()
const emits = defineEmits<AlertDialogEmits>()

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
