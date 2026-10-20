<script setup lang="ts">
import type { ContextMenuCheckboxItemEmits, ContextMenuCheckboxItemProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'

export type UContextMenuCheckboxItemProps = ContextMenuCheckboxItemProps & { class?: HTMLAttributes['class'] }
export type UContextMenuCheckboxItemEmits = ContextMenuCheckboxItemEmits

const props = defineProps<UContextMenuCheckboxItemProps>()
const emits = defineEmits<UContextMenuCheckboxItemEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuCheckboxItem v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <span class="flex size-3.5 pointer-events-none items-center left-2 justify-center absolute">
      <ContextMenuItemIndicator>
        <Icon :name="ICON__CHECK" class="!size-4" />
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuCheckboxItem>
</template>
