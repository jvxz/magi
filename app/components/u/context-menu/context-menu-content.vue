<script lang="ts" setup>
import type { ContextMenuContentEmits, ContextMenuContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<ContextMenuContentProps & { class?: string | undefined }>()
const emits = defineEmits<ContextMenuContentEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuContent
      v-bind="forwarded"
      :class="cn(popoverContentBase(), $props.class)"
      data-slot="context-menu-content"
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
