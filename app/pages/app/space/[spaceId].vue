<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: ['space'],
  name: 'space',
})

const currentSpace = useCurrentSpace()
const joinedRooms = useJoinedRooms(() => currentSpace.value?.roomId)

const currentRoom = useCurrentRoom()
const isPaginating = shallowRef(false)
</script>

<template>
  <LayoutAppSlot name="aside-header">
    <div class="p-2.5 px-4 flex size-full items-center">
      <p class="font-medium">
        {{ currentSpace?.name }}
      </p>
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="aside">
    <UAsideList>
      <UAsideListTab
        :to="{
          name: 'space-browse',
          params: {
            spaceId: $route.params.spaceId,
          },
        }"
      >
        <UAsideListButtonIcon icon="tabler:list-search" />
        Browse Rooms
      </UAsideListTab>
      <UAsideListButton>
        <UAsideListButtonIcon icon="tabler:users" />
        Members
      </UAsideListButton>

      <UAsideListSeparator />

      <template v-if="!isTestMode()">
        <UAsideListTab
          v-for="room in joinedRooms"
          :key="room.roomId"
          :to="{
            name: 'space-room',
            params: {
              spaceId: $route.params.spaceId,
              roomId: room.roomId,
            },
          }"
        >
          <UAsideListButtonIcon icon="tabler:hash" />
          {{ room.name }}
        </UAsideListTab>
      </template>
      <template v-else>
        <UAsideListTab
          v-for="room in [
            createMockRoom(250, '250'),
            createMockRoom(500, '500'),
            createMockRoom(750, '750'),
          ]"
          :key="room.name"
          :data-testid="`mock-room-${room.roomId}`"
          :to="{
            name: 'space-room',
            params: {
              spaceId: $route.params.spaceId,
              roomId: room.roomId,
            },
          }"
        >
          <UAsideListButtonIcon icon="tabler:hash" />
          {{ room.name }}
        </UAsideListTab>
      </template>
    </UAsideList>
  </LayoutAppSlot>

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
      v-show="currentRoom"
      :room="currentRoom"
      @is-paginating="isPaginating = $event"
    />
    <PageRoomInput />
  </div>

  <NuxtPage keepalive :is-paginating />
</template>
