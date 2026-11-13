<script setup lang="ts">
import type { AlertDialogContentEmits, AlertDialogContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UAlertDialogContentProps = AlertDialogContentProps & {
  class?: HTMLAttributes['class']
  size?: DialogVariants['size']
}
export type UAlertDialogContentEmits = AlertDialogContentEmits

const props = withDefaults(defineProps<UAlertDialogContentProps>(), { size: 'default' })
const emits = defineEmits<UAlertDialogContentEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <AlertDialogPortal>
    <AlertDialogOverlay :class="cn(overlayStyles, props.class)" />
    <AlertDialogContent v-bind="forwarded" :class="cn(dialogStyles({ size }), props.class)">
      <slot />
    </AlertDialogContent>
  </AlertDialogPortal>
</template>
