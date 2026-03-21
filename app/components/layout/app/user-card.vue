<script lang="ts" setup>
const clientStore = useClientStore()

const { data: avatarUrl, pending } = useAsyncData(`userAvatar:${clientStore.client.getUserId()}`, async () => {
  const { avatar_url } = await clientStore.client.getProfileInfo(clientStore.client.getUserId()!)
  if (!avatar_url)
    return

  const url = mxcToHttps(avatar_url, {
    allowDirectLinks: false,
    allowRedirects: true,
    baseUrl: clientStore.client.getHomeserverUrl(),
    height: 32,
    resizeMethod: 'scale',
    useAuthentication: true,
    width: 32,
  })

  if (!url)
    return

  const res = await fetchAuthed(url, clientStore.client, { rawResponseBody: true })

  return URL.createObjectURL(res)
})
</script>

<template>
  <div class="p-3 h-21 w-full bottom-0 left-0 absolute">
    <div class="px-4 border rounded bg-card-2 flex size-full items-center">
      <UAvatar class="size-8" :class="pending && 'animate-pulse'">
        <UAvatarImage v-if="avatarUrl" :src="avatarUrl" />
      </UAvatar>
    </div>
  </div>
</template>
