<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UTableRowProps {
  class?: HTMLAttributes['class']
  divide?: boolean
}

const props = withDefaults(defineProps<UTableRowProps>(), { divide: true })
</script>

<template>
  <tr :class="cn(divide && 'divide-x divide-border', props.class)" data-slot="table-row">
    <slot />
  </tr>
</template>
