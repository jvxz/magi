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
const roomId = computed(() => route.params.directRoomId)

const params = useKnownSearchParams()
const { data: summary } = useRoomSummary(roomId, () => toArray(params.value.via ?? ''))

const resolvedName = useRoomComputed(roomId, room =>
  room ? resolveRoomName(room) : summary.value ? summary.value.name : roomId.value,
)

defineAppLabel({ label: resolvedName })

const room = useRoom(() => route.params.directRoomId)
// TODO: handle guest access
const isRoomJoined = useRoomComputed(room, r => (r ? isJoined(r) : false))
</script>

<template>
  <RoomInstance v-if="room && isRoomJoined" :room />
  <RoomPreview v-else :room-id />
</template>
