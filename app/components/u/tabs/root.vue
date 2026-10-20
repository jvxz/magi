<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'

import { TabsRoot, useForwardPropsEmits } from 'reka-ui'

export type UTabsRootProps = TabsRootProps
export type UTabsRootEmits = TabsRootEmits

const props = defineProps<UTabsRootProps>()
const emits = defineEmits<UTabsRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
