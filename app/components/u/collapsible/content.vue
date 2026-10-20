<script lang="ts" setup>
import type { CollapsibleContentEmits, CollapsibleContentProps } from 'reka-ui'

const props = defineProps<CollapsibleContentProps & { class?: HTMLAttributes['class']; bar?: boolean }>()
const emits = defineEmits<CollapsibleContentEmits>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <CollapsibleContent
    v-bind="delegated"
    :class="cn(bar ? 'pl-2.5 pt-2 flex flex-row gap-0 group' : 'flex flex-col gap-2', props.class)"
    data-slot="collapsible-content"
    @content-found="emits('contentFound')"
  >
    <slot />
  </CollapsibleContent>
</template>
