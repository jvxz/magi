<script lang="ts" setup>
definePageMeta({
  layout: 'app',
})

const currentRoom = useCurrentRoom()
</script>

<template>
  <LayoutAppSlot name="aside-header">
    <div class="p-2.5 px-4 flex size-full items-center">
      <p>{{ currentRoom?.name }}</p>
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="px-6 flex gap-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <Icon name="tabler:door" />
          <p>
            Recent rooms
          </p>
        </div>
      </div>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <NuxtPage />
</template>
