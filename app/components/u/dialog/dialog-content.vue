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
    <DialogOverlay :class="cn(overlayStyles)" />
    <DialogContent
      v-bind="forwarded"
      data-slot="dialog-content"
      :class="
        cn(
          staticBase({ variant: 'default' }),
          'fixed top-[50%] left-[50%] overflow-clip z-dialog size-full rounded-none border-0 md:border md:rounded md:h-[90%] md:w-352 translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out data-[state=open]:zoom-in-95 p-0',
          props.class,
        )
      "
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
