<script lang="ts" setup>
import type { CollapsibleContentEmits, CollapsibleContentProps } from 'reka-ui'

const props = defineProps<CollapsibleContentProps & { class?: string }>()
const emits = defineEmits<CollapsibleContentEmits>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <CollapsibleContent
    v-bind="delegated"
    :class="cn('flex flex-col gap-2', $props.class)"
    data-slot="collapsible-content"
    @content-found="emits('contentFound')"
  >
    <slot />
  </CollapsibleContent>
</template>
