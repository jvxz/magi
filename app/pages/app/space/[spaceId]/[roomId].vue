<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-room',
})

const config = useRuntimeConfig()

const currentRoom = config.public.testMode ? createMockRoom(500) : useCurrentRoom()
const currentSpace = useCurrentSpace()

const isPaginating = shallowRef(false)
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader class="px-3.5 flex gap-2 items-center">
      {{ currentRoom?.name ?? currentSpace?.name }}
      <DevOnly>
        <USpinner v-if="isPaginating" class="size-4" />
      </DevOnly>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div class="flex flex-1 flex-col size-full relative">
    <PageRoomEventList
      v-if="currentRoom"
      :room="currentRoom"
      @is-paginating="isPaginating = $event"
    />
    <PageRoomInput />
  </div>
</template>
