<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface USettingGroupTitleProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USettingGroupTitleProps>()
</script>

<template>
  <p :class="cn('text-muted-foreground', props.class)" data-slot="setting-group-title">
    <slot />
  </p>
</template>
