<script setup lang="ts">
import type { SelectSeparatorProps } from 'reka-ui'

export type USelectSeparatorProps = SelectSeparatorProps & { class?: HTMLAttributes['class'] }

const props = defineProps<USelectSeparatorProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <SelectSeparator
    data-slot="select-separator"
    v-bind="delegated"
    :class="cn('pointer-events-none -mx-1 my-1 h-px bg-border-strong', props.class)"
  />
</template>
