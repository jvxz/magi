<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const props = defineProps<{
  room: Room
}>()

const { client } = useMatrixClient()

const avatar = getRoomAvatarUrl({client:client.value,
  room: props.room,
  useAuthentication: true,
  size: 96
})
</script>

<template>
  <LayoutAppAsideButton class="size-11 p-0 overflow-hidden" :tooltip="room.name">
    <Img
      :src="avatar"
      :alt="room.name"
      class="size-full"
    />
  </LayoutAppAsideButton>
</template>
