<script setup lang="ts">
import type { ContextMenuRadioItemEmits, ContextMenuRadioItemProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'

export type UContextMenuRadioItemProps = ContextMenuRadioItemProps & { class?: HTMLAttributes['class'] }
export type UContextMenuRadioItemEmits = ContextMenuRadioItemEmits

const props = defineProps<UContextMenuRadioItemProps>()
const emits = defineEmits<UContextMenuRadioItemEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ContextMenuRadioItem v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <span class="flex size-3.5 pointer-events-none items-center left-2 justify-center absolute">
      <ContextMenuItemIndicator>
        <Icon :name="ICON__RADIO" class="!size-2" />
      </ContextMenuItemIndicator>
    </span>
    <slot />
  </ContextMenuRadioItem>
</template>
