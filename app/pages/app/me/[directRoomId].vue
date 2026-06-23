<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: ({ params }) => {
    if ('directRoomId' in params && !params.directRoomId) {
      return navigateTo({
        name: 'me',
      })
    }
  },
  name: 'direct-room',
})

const route = useRoute()
const room = useRoom(() => route.params.directRoomId)

// const { self } = useSelf()
// const user = useUser(() => room.value?.getMembers().filter(m => m.userId !== self.value?.userId)[0]?.userId)
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <span> {{ room ? resolveRoomName(room) : 'Unknown room' }}</span>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <RoomInstance :room="route.params.directRoomId" :with-members-list="false" />
</template>
