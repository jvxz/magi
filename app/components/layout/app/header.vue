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
  <header class="shrink-0 grid grid-cols-3 h-app-header-height items-center justify-between *:shrink-0">
    <div class="flex flex-1 items-center">
      <span v-if="env" class="text-xs text-muted-foreground font-medium ml-2">
        {{ env }}
      </span>
    </div>
    <LayoutAppHeaderText />
    <div class="px-2 text-right">
      <p v-if="$config.showLoadTime" class="text-sm text-muted-foreground tabular-nums">
        {{ $_loadTime }}
      </p>
    </div>
  </header>
</template>
