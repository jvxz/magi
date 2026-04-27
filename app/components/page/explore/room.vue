<script lang="ts" setup>
import type { IPublicRoomsChunkRoom } from 'matrix-js-sdk'

const props = defineProps<{
  room: IPublicRoomsChunkRoom | undefined
}>()

const { client } = useMatrixClient()

const src = computed(
  () => (props.room && props.room.avatar_url)
    ? mxcToHttps(props.room.avatar_url, {
      allowDirectLinks: false,
      allowRedirects: true,
      baseUrl: client.value.getHomeserverUrl(),
      height: 32,
      resizeMethod: 'scale',
      useAuthentication: true,
      width: 32,
    }) ?? ''
    : '',
)
</script>

<template>
  <div
    class="rounded-lg w-full relative overflow-hidden"
    :class="!room && 'animate-pulse border'"
  >
    <div class="h-full inset-0 absolute">
      <LazyImg
        :size="32"
        :alt="room?.name"
        :src
        class="size-full scale-120 object-cover -m-px -translate-y-1/3 data-[error=false]:blur-xl"
        :do-placeholder="false"
      />
    </div>

    <div class="mt-2/5 p-4 pt-1/8 border border-t-0 rounded-b-lg bg-card-lighter flex flex-col gap-2 relative z-10 isolate">
      <AvatarRoot class="border-5 border-card-lighter rounded-2xl bg-card-lighter flex size-16 items-center inset-0 left-4 justify-center absolute z-10 overflow-hidden -top-1/8">
        <template v-if="room">
          <AvatarImage
            v-if="src"
            :src="src"
          />
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

      <RenderMd :content="room ? room?.topic ? room.topic : '(no description)' : ''" class="text-sm tracking-normal h-5lh w-full text-pretty line-clamp-5" />

      <div class="text-xs text-muted-foreground pt-4 flex gap-2 items-center">
        <Icon
          v-if="room"
          name="tabler:user-filled"
          class="size-1lh"
        />
        <p class="h-1lh">
          <span v-if="room" class="font-medium tabular-nums">{{ room.num_joined_members }}</span> {{ room ? "members" : "" }}
        </p>
      </div>
    </div>
  </div>
</template>
