<script lang="ts" setup>
defineProps<{
  title: PowerLevelName
  total: number
}>()
</script>

<template>
  <div class="text-xs text-muted-foreground font-medium px-2 pb-0.5 flex h-8 w-full items-end">
    <p>{{ upperFirst(title) }} — {{ total }}</p>
  </div>
</template>
