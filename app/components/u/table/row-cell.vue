<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UTableRowCellProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UTableRowCellProps>()
</script>

<template>
  <td :class="cn('px-3 py-2', props.class)" data-slot="table-row-cell">
    <slot />
  </td>
</template>
