<script lang="ts" setup>
const env = computed<string | undefined>(() => {
  if (isTestMode())
    return 'Testing'

  if (import.meta.dev)
    return 'Development'

  return undefined
})
</script>

<template>
  <header class="flex shrink-0 h-app-header-height items-center justify-between *:shrink-0">
    <div class="flex flex-1 items-center">
      <span v-if="env" class="text-xs text-muted-foreground font-medium ml-2">
        {{ env }}
      </span>
    </div>
    <LayoutAppHeaderText />
    <div class="flex-1" />
  </header>
</template>
