<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface USettingGroupRootProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USettingGroupRootProps>()
</script>

<template>
  <div :class="cn('flex flex-col gap-2', props.class)" data-slot="setting-group-root">
    <slot />
  </div>
</template>
