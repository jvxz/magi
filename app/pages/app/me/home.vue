<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'me-home',
})
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="flex gap-2 items-center">
        <Icon name="tabler:home" />
        <p>Home</p>
      </div>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <UContextMenuRegionRoot name="homeRoom">
    <div class="p-3 flex flex-col gap-2">
      <PageMePinnedRoomsList />
      <PageMeRecentRoomsList />
    </div>

    <PageMeContextMenu />
  </UContextMenuRegionRoot>
</template>
