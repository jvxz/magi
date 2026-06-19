<script lang="ts" setup>
import type { DialogCloseProps } from 'reka-ui'

import type { ButtonProps } from '../button.vue'

const props = defineProps<DialogCloseProps & ButtonProps & { class?: string }>()

const delegated = reactiveOmit(props, ['class', 'variant', 'size'])
</script>

<template>
  <DialogClose v-bind="delegated" :class="cn(buttonVariants({ variant, size }), $props.class)" data-slot="dialog-close">
    <slot />
  </DialogClose>
</template>
