<template>
  <div
    v-bind="$attrs"
    :class="cn('rounded bg-muted relative overflow-clip', $attrs.class)"
    aria-busy
  >
    <div
      class="bg-gradient-linear h-full w-10 ease from-transparent to-transparent via-foreground/3 bg-gradient-to-r/oklch"
      :style="{
        animation: 'skeleton 1.4s infinite',
        willChange: 'transform',
      }"
    />
  </div>
</template>
