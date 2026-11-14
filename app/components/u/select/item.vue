<script setup lang="ts">
import type { SelectItemProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

export type USelectItemProps = SelectItemProps & { class?: HTMLAttributes['class'] }

const props = defineProps<USelectItemProps>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <SelectItem
    data-slot="select-item"
    v-bind="forwarded"
    :class="
      cn(popoverItemBase(), 'relative flex w-full flex-row cursor-default items-center group/select-item', props.class)
    "
  >
    <SelectItemIndicator
      class="size-4 group-data-[slot=select-rich-item]/select-item:pe-1 group-data-[slot=select-rich-item]/select-item:pt-0.5"
    >
      <slot name="indicator-icon">
        <Icon :name="ICON__CHECK" />
      </slot>
    </SelectItemIndicator>

    <SelectItemText
      class="shrink group-not-data-[state=checked]/select-item:ps-6 group-data-[slot=select-rich-item]/select-item:group-not-data-[state=checked]/select-item:ps-5"
    >
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
