<script lang="ts">
export const TOOLTIP_ICON_META = {
  direct: {
    icon: 'tabler:send-2',
    text: 'Direct room',
  },
  encrypted: {
    icon: 'tabler:lock',
    text: 'Encrypted',
  },
} as const

export type TooltipIcons = keyof typeof TOOLTIP_ICON_META
export type TooltipIconMeta<T extends TooltipIcons> = (typeof TOOLTIP_ICON_META)[T]
</script>

<script lang="ts" setup>
import type { TooltipRootEmits, TooltipRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<TooltipRootProps & { class?: string; name: TooltipIcons }>()
const emits = defineEmits<TooltipRootEmits>()

const delegated = reactiveOmit(props, ['class', 'name'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <UTooltipRoot v-bind="forwarded">
    <UTooltipTrigger as-child>
      <Icon :name="TOOLTIP_ICON_META[name].icon" :class="props.class" />
    </UTooltipTrigger>
    <UTooltipContent>
      <slot>{{ TOOLTIP_ICON_META[name].text }}</slot>
    </UTooltipContent>
  </UTooltipRoot>
</template>
