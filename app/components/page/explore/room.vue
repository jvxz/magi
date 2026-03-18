<script lang="ts" setup>
import type { IPublicRoomsChunkRoom } from 'matrix-js-sdk'

const props = defineProps<{
  room: IPublicRoomsChunkRoom | undefined
}>()

const src = computed(
  () => (props.room && props.room.avatar_url)
    ? mxcToHttps(props.room.avatar_url, {
      allowDirectLinks: false,
      allowRedirects: true,
      height: 32,
      resizeMethod: 'scale',
      useAuthentication: false,
      width: 32,
    }) ?? ''
    : '',
)
</script>

<template>
  <div class="rounded-lg w-full relative overflow-hidden" :class="!room && 'animate-pulse'">
    <div class="h-full inset-0 absolute">
      <NuxtImg
        :src
        class="bg-primary size-full scale-120 object-cover blur-xl -m-px -translate-y-1/3"
        :class="{
          'bg-card-2! blur-none!': !room,
        }"
      />
    </div>

    <div class="mt-2/5 border rounded-b-lg border-t-0 p-4 pt-1/8 bg-card-2 flex flex-col gap-2 relative z-10 isolate">
      <AvatarRoot class="border-5 border-card-2 rounded-2xl bg-card-2 flex size-16 items-center inset-0 left-4 justify-center absolute z-10 overflow-hidden -top-1/8">
        <template v-if="room">
          <AvatarImage :src />
          <AvatarFallback class="text-sm text-foreground font-medium">
            {{ room.name ? room.name.slice(0, 2) : room.room_id.slice(0, 2) }}
          </AvatarFallback>
        </template>
      </AvatarRoot>

      <h3
        :title="room && room.name"
        class="font-medium h-1lh w-full truncate"
      >
        {{ room && room.name }}
      </h3>

      <p class="text-sm tracking-normal h-5lh w-full text-pretty line-clamp-5">
        {{ room ? room?.topic ? room.topic : "(no description)" : "" }}
      </p>

      <div class="text-xs text-muted-foreground pt-4 flex gap-2 items-center">
        <Icon
          v-if="room"
          name="mingcute:user-2-fill"
          class="size-1lh"
        />
        <p class="h-1lh">
          <span v-if="room" class="font-medium tabular-nums">{{ $n(room.num_joined_members) }}</span> {{ room ? "members" : "" }}
        </p>
      </div>
    </div>
  </div>
</template>
