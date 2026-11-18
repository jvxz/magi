<script lang="ts">
function onOpenAutoFocus(e: Event) {
  const marked = (e.target as HTMLElement).querySelector<HTMLElement>('[data-autofocus]')

  const el = marked?.matches('input, textarea') ? marked : marked?.querySelector<HTMLElement>('input, textarea')
  if (!el) return

  e.preventDefault()
  el.focus()

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.select()
}
</script>

<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDialogContentProps = DialogContentProps & {
  class?: HTMLAttributes['class']
  size?: DialogVariants['size']
}
export type UDialogContentEmits = DialogContentEmits

const props = withDefaults(defineProps<UDialogContentProps>(), { size: 'default' })
const emits = defineEmits<UDialogContentEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DialogPortal>
    <DialogOverlay :class="cn(overlayStyles)" data-slot="dialog-content-overlay" />
    <DialogContent
      v-bind="forwarded"
      data-slot="dialog-content"
      :data-size="size"
      :class="cn(dialogStyles({ size }), props.class)"
      @open-auto-focus="onOpenAutoFocus"
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
