<script lang="ts" setup>
defineProps<{
  title?: string
}>()

const currentRoom = useCurrentRoom()

const env = computed(() => {
  if (!import.meta.dev)
    return

  if (import.meta.dev)
    return 'Development'

  if (import.meta.test)
    return 'Testing'

  return undefined
})
</script>

<template>
  <header class="flex shrink-0 h-app-header-height items-center justify-between *:shrink-0">
    <div class="flex flex-1 items-center">
      <span class="text-xs text-muted-foreground font-medium ml-2">{{ env }}</span>
    </div>
    <p class="text-sm font-medium text-center w-auto">
      {{ title ?? currentRoom?.name ?? upperFirst($route.name) }}
    </p>
    <div class="flex-1" />
  </header>
</template>
