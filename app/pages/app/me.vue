<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'me',
})
</script>

<template>
  <LayoutAppSlot name="aside-header">
    <div class="px-2.5 flex size-full items-center justify-center">
      <UButton variant="soft" class="w-full">
        <p class="text-xs">Find or start a conversation</p>
      </UButton>
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="aside">
    <div class="p-1">
      <PageMeAsideButtons />
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="px-6 flex gap-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <Icon name="tabler:home" />
          <p>Home</p>
        </div>
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

  <NuxtPage />
</template>
