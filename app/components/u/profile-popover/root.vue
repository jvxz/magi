<script lang="ts" setup>
const { open } = useProfilePopover()
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <slot />
  </PopoverRoot>
</template>
