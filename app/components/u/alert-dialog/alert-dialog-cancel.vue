<script setup lang="ts">
import type { AlertDialogCancelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import type { ButtonProps } from '../button.vue'

import { injectAlertDialogPreventClose } from './alert-dialog-root.vue'

const props = withDefaults(defineProps<AlertDialogCancelProps & ButtonProps & { class?: HTMLAttributes['class'] }>(), {
  variant: 'ghost',
})

const { preventClose } = injectAlertDialogPreventClose()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogCancel
    v-bind="delegatedProps"
    :disabled="preventClose"
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
