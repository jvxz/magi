<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

export interface ClickToCopyProps extends PrimitiveProps {
  text?: string
  class?: HTMLAttributes['class']
  withTitle?: boolean
  copiedDuration?: number
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
}
</script>

<script lang="ts" setup>
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ClickToCopyProps>(), {
  as: 'button',
  copiedDuration: 1000,
  side: 'top',
  sideOffset: 4,
  withTitle: true,
})

const emit = defineEmits<{ copy: [text: string] }>()

const { polite } = useAnnouncer()

const el = useTemplateRef('el')
const { copied, copy } = useClipboard({ copiedDuring: props.copiedDuration, legacy: true })

async function onCopy() {
  const text = props.text ?? unrefElement(el)?.textContent?.trim() ?? ''
  if (!text) return

  await copy(text)
  emit('copy', text)
  polite('Copied text')
}

defineExpose({ copied, copy: onCopy })
</script>

<template>
  <PopoverRoot :open="copied">
    <PopoverAnchor as-child>
      <Primitive
        ref="el"
        v-bind="$attrs"
        :as
        :as-child
        data-slot="click-to-copy"
        :data-copied="copied ? '' : undefined"
        class="cursor-pointer"
        :title="withTitle ? 'Click to copy' : undefined"
        @click="onCopy"
      >
        <slot :copied :copy="onCopy" />
      </Primitive>
    </PopoverAnchor>

    <PopoverPortal>
      <PopoverContent
        :side
        :side-offset
        aria-hidden="true"
        :class="
          cn(
            'z-tooltip text-xs font-medium pointer-events-none flex items-center gap-1',
            'data-[state=open]:(animate-in fade-in)',
            'data-[state=closed]:(animate-out fade-out)',
            'data-[side=top]:(data-[state=open]:slide-in-b-1 data-[state=closed]:slide-out-t-1)',
            'data-[side=bottom]:(data-[state=open]:slide-in-t-1 data-[state=closed]:slide-out-b-1)',
            'data-[side=left]:(data-[state=open]:slide-in-r-1 data-[state=closed]:slide-out-l-1)',
            'data-[side=right]:(data-[state=open]:slide-in-l-1 data-[state=closed]:slide-out-r-1)',
            props.class,
          )
        "
        @open-auto-focus.prevent
        @close-auto-focus.prevent
      >
        <slot name="overlay" :copied :copy="onCopy">
          <Icon :name="ICON__CHECK" class="size-1em" />
        </slot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
