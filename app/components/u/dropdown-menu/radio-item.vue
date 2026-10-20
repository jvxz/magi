<script setup lang="ts">
import type { DropdownMenuRadioItemEmits, DropdownMenuRadioItemProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuRadioItemProps = DropdownMenuRadioItemProps & { class?: HTMLAttributes['class'] }
export type UDropdownMenuRadioItemEmits = DropdownMenuRadioItemEmits

const props = defineProps<UDropdownMenuRadioItemProps>()

const emits = defineEmits<UDropdownMenuRadioItemEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuRadioItem v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <span class="flex size-3.5 pointer-events-none items-center left-2 justify-center absolute">
      <DropdownMenuItemIndicator>
        <Icon :name="ICON__RADIO" class="size-2 fill-current" />
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuRadioItem>
</template>
