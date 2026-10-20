<script lang="ts" setup>
import type { ContextMenuContentEmits, ContextMenuContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UContextMenuContentProps = ContextMenuContentProps & { class?: HTMLAttributes['class'] }
export type UContextMenuContentEmits = ContextMenuContentEmits

const props = defineProps<UContextMenuContentProps>()
const emits = defineEmits<UContextMenuContentEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuContent
      v-bind="forwarded"
      :class="cn(popoverContentBase(), props.class)"
      data-slot="context-menu-content"
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
