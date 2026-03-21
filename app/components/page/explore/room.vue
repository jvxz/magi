<script lang="ts" setup>
import type { IPublicRoomsChunkRoom } from 'matrix-js-sdk'
import { Method } from 'matrix-js-sdk'

const props = defineProps<{
  room: IPublicRoomsChunkRoom | undefined
}>()

const clientStore = useClientStore()

const src = computed(
  () => (props.room && props.room.avatar_url)
    ? mxcToHttps(props.room.avatar_url, {
      allowDirectLinks: false,
      allowRedirects: true,
      baseUrl: clientStore.client.getHomeserverUrl(),
      height: 32,
      resizeMethod: 'scale',
      useAuthentication: true,
      width: 32,
    }) ?? ''
    : '',
)

const isIntersecting = ref(false)

const nuxtApp = useNuxtApp()
const { data: imageData } = useAsyncData(() => `avatar:${props.room?.room_id}`, async () => {
  try {
    if (!isIntersecting.value)
      return

    const url = new URL(src.value)

    const queryParams: Record<string, string> = {}
    url.searchParams.forEach((v, k) => {
      queryParams[k] = v
    })

    const blob = await clientStore.client.http.authedRequest<Blob>(
      Method.Get,
      url.pathname,
      queryParams,
      undefined,
      { prefix: '', rawResponseBody: true },
    )

    return URL.createObjectURL(blob)
  }
  catch {}
}, {
  getCachedData: key => nuxtApp.payload.data?.[key] || nuxtApp.static?.data?.[key] || undefined,
  lazy: true,
  server: false,
  watch: [src, isIntersecting],
})

const container = useTemplateRef<HTMLDivElement>('container')
useIntersectionObserver(container, (entries) => {
  if (entries[0])
    isIntersecting.value = entries[0].isIntersecting
})
</script>

<template>
  <div
    ref="container"
    class="rounded-lg w-full relative overflow-hidden"
    :class="!room && 'animate-pulse border'"
  >
    <div class="h-full inset-0 absolute">
      <LazyNuxtImg
        v-if="imageData && isIntersecting"
        :src="imageData"
        :data-loaded="room ? 'true' : 'false'"
        class="bg-primary size-full scale-120 object-cover blur-xl -m-px data-[loaded=false]:bg-card-2 -translate-y-1/3 data-[loaded=false]:blur-none"
      />
    </div>

    <div class="mt-2/5 p-4 pt-1/8 border border-t-0 rounded-b-lg bg-card-2 flex flex-col gap-2 relative z-10 isolate">
      <AvatarRoot class="border-5 border-card-2 rounded-2xl bg-card-2 flex size-16 items-center inset-0 left-4 justify-center absolute z-10 overflow-hidden -top-1/8">
        <template v-if="room">
          <AvatarImage v-if="imageData" :src="imageData" />
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
