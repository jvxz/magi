<script setup lang="ts">
export interface UContextMenuShortcutProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UContextMenuShortcutProps>()
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest text-muted-foreground', props.class)">
    <slot />
  </span>
</template>
