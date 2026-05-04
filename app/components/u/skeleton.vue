<script lang="ts" setup>
withDefaults(
  defineProps<{ delay?: number, shimmer?: boolean }>(),
  {
    delay: 1400,
    shimmer: true,
  },
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('rounded bg-muted relative overflow-clip', $attrs.class)"
    aria-busy
  >
    <div
      v-if="shimmer"
      class="bg-gradient-linear size-full ease from-transparent to-transparent via-foreground/3 bg-gradient-to-r/oklch"
      :style="{
        animation: `skeleton ${delay}ms infinite`,
        willChange: 'transform',
      }"
    />
  </div>
</template>
