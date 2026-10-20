<script setup lang="ts">
import type { HoverCardRootEmits, HoverCardRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UHoverCardRootProps = HoverCardRootProps
export type UHoverCardRootEmits = HoverCardRootEmits

const props = withDefaults(defineProps<UHoverCardRootProps>(), {
  openDelay: 0,
})

const emits = defineEmits<UHoverCardRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <HoverCardRoot v-bind="forwarded">
    <slot />
  </HoverCardRoot>
</template>
