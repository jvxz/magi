<script setup lang="ts">
export interface UDropdownMenuShortcutProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UDropdownMenuShortcutProps>()
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest text-muted-foreground', props.class)">
    <slot />
  </span>
</template>
