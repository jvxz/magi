<script lang="ts" setup>
export interface UAsideListButtonIconProps {
  icon?: string
}

const { icon = ICON__ROOM } = defineProps<UAsideListButtonIconProps>()
</script>

<template>
  <Icon :name="icon" class="opacity-75 shrink-0 size-1lh!" />
</template>
