<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: (to) => {
    if (!('spaceId' in to.params)) {
      return navigateTo({
        name: 'me',
      })
    }

    // TODO: add middlware to go to last-visited room
    if (to.name !== 'space-browse' && !('roomId' in to.params)) {
      return navigateTo({
        name: 'space-browse',
        params: {
          spaceId: to.params.spaceId,
        },
      })
    }
  },
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
    </URoomList>
  </LayoutAppSlot>

  <NuxtPage />
</template>
