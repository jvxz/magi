<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <TabsTrigger
    v-bind="forwarded"
    :class="
      cn(
        interactiveBase({ variant: 'ghost' }),
        'relative inline-flex flex-1 size-full cursor-default items-center justify-center border-0 bg-transparent text-sm text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground',
        props.class,
      )
    "
  >
    <span class="truncate">
      <slot />
    </span>
  </TabsTrigger>
</template>
