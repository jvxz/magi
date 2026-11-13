<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface USettingGroupHeaderProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USettingGroupHeaderProps>()
</script>

<template>
  <div :class="cn('flex flex-col', props.class)" data-slot="setting-group-header">
    <slot />
  </div>
</template>
