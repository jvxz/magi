<script lang="ts" setup>
defineProps<{
  title: PowerLevelName
  total: number
}>()
</script>

<template>
  <div class="text-xs font-medium px-1.5 pb-1 flex h-8 w-full items-end">
    <p>{{ upperFirst(title) }} — {{ total }}</p>
  </div>
</template>
