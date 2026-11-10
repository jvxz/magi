<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface USettingGroupTitleProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USettingGroupTitleProps>()
</script>

<template>
  <h2 :class="cn('font-medium', props.class)" data-slot="setting-group-title">
    <slot />
  </h2>
</template>
