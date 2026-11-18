<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface USelectRichItemDescriptionProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USelectRichItemDescriptionProps>()
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground font-normal', props.class)" data-slot="select-rich-item-description">
    <slot />
  </p>
</template>
