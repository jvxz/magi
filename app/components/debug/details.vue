<script lang="ts" setup>
import { breakpointsTailwind } from '@vueuse/core'

const fps = useFps({
  every: 40,
})

const { active } = useBreakpoints(breakpointsTailwind)
const breakpoint = active()
</script>

<template>
  <div class="text-xs text-muted-foreground right-2 top-2 absolute z-100000 font-mono" @click="$router.push('/playground')">
    {{ fps }}
    <span>{{ breakpoint }}</span>
  </div>
</template>
