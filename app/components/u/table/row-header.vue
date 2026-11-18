<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UTableRowHeaderProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UTableRowHeaderProps>()
</script>

<template>
  <th :class="cn('font-semibold px-3 py-1', props.class)" data-slot="table-row-header">
    <slot />
  </th>
</template>
