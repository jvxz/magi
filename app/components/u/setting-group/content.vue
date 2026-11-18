<script lang="ts" setup>
import type { UCardGroupRootProps } from '../card-group/root.vue'

export interface USettingGroupContentProps extends UCardGroupRootProps {}

const props = defineProps<USettingGroupContentProps>()
</script>

<template>
  <UCardGroupRoot v-bind="props" data-slot="setting-group-content">
    <slot />
  </UCardGroupRoot>
</template>
