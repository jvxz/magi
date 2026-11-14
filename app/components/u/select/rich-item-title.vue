<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface USelectRichItemTitleProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USelectRichItemTitleProps>()
</script>

<template>
  <p v-bind="props" data-slot="select-rich-item-title">
    <slot />
  </p>
</template>
