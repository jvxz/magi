<script lang="ts" setup>
import type { UToggleGroupItemProps } from '../toggle-group/item.vue'

export interface USidebarLayoutGroupItemProps extends UToggleGroupItemProps {}

export interface SidebarLayoutGroupItem {
  key: string
  icon?: string
}

const props = defineProps<USidebarLayoutGroupItemProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UToggleGroupItem
    v-bind="delegated"
    :class="cn('w-full flex items-center gap-2', props.class)"
    data-slot="sidebar-layout-group-item"
  >
    <slot />
  </UToggleGroupItem>
</template>
