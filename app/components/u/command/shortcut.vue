<script setup lang="ts">
export interface UCommandShortcutProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UCommandShortcutProps>()
</script>

<template>
  <span :class="cn('ml-auto rounded-md bg-muted/50 p-1 text-xs tracking-widest text-muted-foreground', props.class)">
    <slot />
  </span>
</template>
