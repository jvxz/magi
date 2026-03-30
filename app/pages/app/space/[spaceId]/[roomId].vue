<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-room',
})

const currentRoom = useCurrentRoom()
const currentSpace = useCurrentSpace()
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="px-6 flex gap-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <p>
            {{ currentRoom?.name }}
          </p>
        </div>
      </div>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      {{ currentRoom?.name ?? currentSpace?.name }}
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <pre>{{ currentRoom?.name }}</pre>
</template>
