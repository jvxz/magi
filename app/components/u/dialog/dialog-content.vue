<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<DialogContentProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DialogContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay :class="cn(overlayStyles)" data-slot="dialog-content-overlay" />
    <DialogContent v-bind="forwarded" data-slot="dialog-content" :class="cn(dialogStyles(), props.class)">
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
