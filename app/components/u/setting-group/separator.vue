<script lang="ts" setup>
import type { UCardGroupSeparatorProps } from '../card-group/separator.vue'

export interface USettingGroupSeparatorProps extends UCardGroupSeparatorProps {}

const props = defineProps<USettingGroupSeparatorProps>()
</script>

<template>
  <UCardGroupSeparator v-bind="props" data-slot="setting-group-separator">
    <slot />
  </UCardGroupSeparator>
</template>
