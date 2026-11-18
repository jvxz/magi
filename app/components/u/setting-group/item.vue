<script lang="ts" setup>
import type { UCardGroupItemProps } from '../card-group/item.vue'

export interface USettingGroupItemProps extends UCardGroupItemProps {}

const props = defineProps<USettingGroupItemProps>()
</script>

<template>
  <UCardGroupItem v-bind="props" data-slot="setting-group-item">
    <slot />
  </UCardGroupItem>
</template>
