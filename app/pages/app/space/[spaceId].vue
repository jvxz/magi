<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: ['space'],
  name: 'space',
})

const currentSpace = useCurrentSpace()
const joinedRooms = useJoinedRooms(() => currentSpace.value?.roomId)
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
    <URoomList>
      <URoomListTab
        :to="{
          name: 'space-browse',
          params: {
            spaceId: $route.params.spaceId,
          },
        }"
      >
        <URoomListButtonIcon icon="tabler:list-search" />
        Browse Rooms
      </URoomListTab>
      <URoomListButton>
        <URoomListButtonIcon icon="tabler:users" />
        Members
      </URoomListButton>

      <URoomListSeparator />

      <template v-if="!isTestMode()">
        <URoomListTab
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
          <URoomListButtonIcon icon="tabler:hash" />
          {{ room.name }}
        </URoomListTab>
      </template>
      <template v-else>
        <URoomListTab
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
          <URoomListButtonIcon icon="tabler:hash" />
          {{ room.name }}
        </URoomListTab>
      </template>
    </URoomList>
  </LayoutAppSlot>

  <NuxtPage />
</template>
