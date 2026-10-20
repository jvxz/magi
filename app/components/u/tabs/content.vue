<script setup lang="ts">
import type { TabsContentProps } from 'reka-ui'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <TabsContent :class="cn('flex-1 outline-none', props.class)" v-bind="delegatedProps">
    <slot />
  </TabsContent>
</template>
