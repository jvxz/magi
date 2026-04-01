<script setup lang="ts">
import type { ImgProps } from '~/components/img.vue'

const props = defineProps<Omit<ImgProps, 'src' | 'alt'> & {
  user: {
    avatarUrl?: string
    displayName?: string
  } | undefined
  square?: boolean
}>()

const { client } = useMatrixClient()

const reducedMotion = usePreferredReducedMotion()
const src = computed(() => {
  if (!props.user?.avatarUrl)
    return IMG_PLACEHOLDER_URL

  if (isMxc(props.user?.avatarUrl)) {
    return mxcToHttps(props.user.avatarUrl, {
      allowRedirects: true,
      animated: reducedMotion.value !== 'reduce',
      baseUrl: client.value.getHomeserverUrl(),
      // don't adhere to size prop to allow caching; url doesn't match when size is different
      height: 400,
      resizeMethod: 'scale',
      useAuthentication: true,
      width: 400,
    })
  }

  return props.user.avatarUrl
})
</script>

<template>
  <Img
    v-bind="props"
    :key="user?.avatarUrl"
    :alt="user?.displayName ? `${user?.displayName}'s avatar` : 'Avatar'"
    :src
    :class="cn(!square && 'rounded-full', props.class)"
  />
</template>
