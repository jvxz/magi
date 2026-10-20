<script setup lang="ts">
import type { TabsContentProps } from 'reka-ui'

export type UTabsContentProps = TabsContentProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UTabsContentProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <TabsContent :class="cn('flex-1 outline-none', props.class)" v-bind="delegated">
    <slot />
  </TabsContent>
</template>
