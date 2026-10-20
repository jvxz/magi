<script lang="ts" setup>
import type { DialogCloseProps } from 'reka-ui'

import type { UButtonProps } from '../button.vue'

import { buttonVariants } from '../button.vue'

export type UDialogCloseProps = DialogCloseProps & UButtonProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UDialogCloseProps>()

const delegated = reactiveOmit(props, ['class', 'variant', 'size'])
</script>

<template>
  <DialogClose v-bind="delegated" :class="cn(buttonVariants({ variant, size }), props.class)" data-slot="dialog-close">
    <slot />
  </DialogClose>
</template>
