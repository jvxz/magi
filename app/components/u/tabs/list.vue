<script setup lang="ts">
import type { TabsListProps } from 'reka-ui'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <TabsList
    v-bind="delegated"
    :class="
      cn(
        staticBase({ variant: 'default' }),
        interactiveBase({ size: 'lg' }),
        'relative inline-flex w-fit items-center justify-center gap-2 p-1',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
