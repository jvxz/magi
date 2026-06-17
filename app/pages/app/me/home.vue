<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'me-home',
})
</script>

<template>
  <UContextMenuRegionRoot name="homeRoom">
    <div class="p-3 flex flex-col gap-2">
      <PageMePinnedRoomsList />
      <PageMeRecentRoomsList />
    </div>

    <PageMeContextMenu />
  </UContextMenuRegionRoot>
</template>
