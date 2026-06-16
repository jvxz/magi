<script lang="ts" setup>
import type { CollapsibleContentEmits, CollapsibleContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<CollapsibleContentProps & { class?: string }>()
const emits = defineEmits<CollapsibleContentEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <CollapsibleContent
    v-bind="forwarded"
    :class="cn('flex flex-col gap-2', $props.class)"
    data-slot="collapsible-content"
  >
    <slot />
  </CollapsibleContent>
</template>
