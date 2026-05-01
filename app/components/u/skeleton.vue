<script lang="ts" setup>
const { delay = 1400 } = defineProps<{ delay?: number }>()
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('rounded bg-muted relative overflow-clip', $attrs.class)"
    aria-busy
  >
    <div
      class="bg-gradient-linear size-full ease from-transparent to-transparent via-foreground/3 bg-gradient-to-r/oklch"
      :style="{
        animation: `skeleton ${delay}ms infinite`,
        willChange: 'transform',
      }"
    />
  </div>
</template>
