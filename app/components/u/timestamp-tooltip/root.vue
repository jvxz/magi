<script lang="ts" setup>
const { open } = useRoomEventTimestampTooltip()
</script>

<template>
  <PopoverRoot v-model:open="open">
    <VisuallyHidden>
      <PopoverAnchor />
    </VisuallyHidden>

    <slot />
  </PopoverRoot>
</template>
