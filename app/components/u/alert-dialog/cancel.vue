<script setup lang="ts">
import type { AlertDialogCancelProps } from 'reka-ui'

import type { UButtonProps } from '../button.vue'

import { buttonVariants } from '../button.vue'
import { injectAlertDialogPreventClose } from './root.vue'

export type UAlertDialogCancelProps = AlertDialogCancelProps & UButtonProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UAlertDialogCancelProps>(), {
  variant: 'ghost',
})

const { preventClose } = injectAlertDialogPreventClose()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogCancel
    v-bind="delegated"
    :disabled="preventClose || props.disabled"
    :class="
      cn(
        buttonVariants({
          variant,
          size,
        }),
        props.class,
      )
    "
  >
    <slot />
  </AlertDialogCancel>
</template>
