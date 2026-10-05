<script lang="ts" setup>
const { open } = useProfilePopover()
</script>

<template>
  <PopoverRoot v-model:open="open">
    <VisuallyHidden>
      <PopoverAnchor />
    </VisuallyHidden>

    <slot />
  </PopoverRoot>
</template>
