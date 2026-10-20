<script setup lang="ts">
import type { DropdownMenuSubTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<DropdownMenuSubTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <DropdownMenuSubTrigger v-bind="forwarded" :class="cn(popoverItemBase(), props.class)">
    <slot />
    <Icon :name="ICON__CHEVRON_RIGHT" class="ml-auto size-4" />
  </DropdownMenuSubTrigger>
</template>
