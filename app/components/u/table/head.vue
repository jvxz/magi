<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UTableHeadProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UTableHeadProps>()
</script>

<template>
  <thead :class="cn('border-border border-b bg-surface-raised', props.class)" data-slot="table-head">
    <slot />
  </thead>
</template>
