<script setup lang="ts">
import type { AlertDialogActionProps } from 'reka-ui'

import type { UButtonProps } from '../button.vue'

import { buttonVariants } from '../button.vue'

export type UAlertDialogActionProps = AlertDialogActionProps & UButtonProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAlertDialogActionProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogAction v-bind="delegated" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </AlertDialogAction>
</template>
