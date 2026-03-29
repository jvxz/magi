<script lang="ts" setup>
defineProps<{
  title?: string
}>()

const currentRoom = useCurrentRoom()
</script>

<template>
  <header class="flex shrink-0 h-app-header-height items-center justify-center">
    <p class="text-sm font-medium">
      {{ title ?? currentRoom?.name ?? upperFirst($route.name) }}
    </p>
  </header>
</template>
