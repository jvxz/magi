<script lang="ts" setup>
definePageMeta({
  key: 'space',
  layout: 'app',
  middleware: ['space'],
  name: 'space',
})

const currentSpace = useCurrentSpace()
const joinedRooms = useSpaceJoinedRooms(() => currentSpace.value?.roomId)

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
            createMockRoom({ id: '250', seedMessages: 250 }).room,
            createMockRoom({ id: '500', seedMessages: 500 }).room,
            createMockRoom({ id: '750', seedMessages: 750 }).room,
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

  <LayoutAppSlot v-if="currentRoom" name="page-header">
    <LayoutAppPageHeader class="px-3.5 flex gap-2 items-center">
      {{ currentRoom.name }}
      <DevOnly>
        <USpinner v-if="isPaginating" class="size-4" />
      </DevOnly>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div v-if="currentRoom" class="flex flex-1 size-full">
    <div class="flex flex-col size-full relative">
      <PageRoomEventList :room="currentRoom" @is-paginating="isPaginating = $event" />
      <PageRoomInput />
    </div>

    <PageRoomMembersList />
    <PageRoomEventReactionsViewer />
  </div>

  <NuxtPage :is-paginating />
</template>
