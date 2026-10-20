<script setup lang="ts">
export interface UAlertDialogFooterProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UAlertDialogFooterProps>()
</script>

<template>
  <div :class="cn('flex flex-col-reverse mt-4 gap-2 sm:flex-row sm:justify-end w-full', props.class)">
    <slot />
  </div>
</template>
