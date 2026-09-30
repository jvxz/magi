<script lang="ts" setup>
const { icon = ICON__ROOM } = defineProps<{
  icon?: string
}>()
</script>

<template>
  <Icon :name="icon" class="opacity-75 shrink-0 size-1lh!" />
</template>
