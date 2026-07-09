<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const props = defineProps<{
  room: Room
}>()

const { client } = useMatrixClient()

const avatar = getRoomAvatarUrl({ client: client.value, room: props.room, size: 96, useAuthentication: true })
</script>

<template>
  <LayoutAppAsideButton as-child class="p-0 size-11 overflow-hidden" :tooltip="room.name">
    <UContextMenuRegionTrigger as-child region="asideRoom" :value="{ room }">
      <NuxtLink
        active-class="anchor-name-active"
        :to="{
          name: 'space',
          params: {
            spaceId: room.roomId,
          },
        }"
      >
        <Img :src="avatar" :alt="room.name" class="size-full" />
      </NuxtLink>
    </UContextMenuRegionTrigger>
  </LayoutAppAsideButton>
</template>
