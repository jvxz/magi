<script lang="ts" setup>
const { icon = 'tabler:hash' } = defineProps<{
  icon: string
}>()
</script>

<template>
  <Icon :name="icon" class="opacity-75 shrink-0 size-1lh!" />
</template>
