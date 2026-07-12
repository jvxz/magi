<script setup lang="ts">
import { useForwardPropsEmits } from 'reka-ui'

import type { ImgEmits, ImgProps } from '~/components/img.vue'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'alt'> & {
  square?: boolean
  imageSize?: AvatarImageSize
  placeholderKey?: string
  direct?: boolean
  isLoading?: boolean
  room?: MaybeRoomOrId | undefined | null
  user?: MaybeUserOrId | undefined | null
  src?: string | undefined | null
}

export type MatrixAvatarEmits = ImgEmits

const props = withDefaults(defineProps<MatrixAvatarProps>(), {
  imageSize: 'small',
})
const emits = defineEmits<ImgEmits>()

const room = useRoom(() => props.room ?? undefined)
const userProfile = useUserProfile(() => props.user ?? undefined)

const alt = computed(() => {
  if (room.value) return room.value.name ?? room.value.roomId ?? ''

  if (userProfile.value) return userProfile.value.displayname ?? (props.user ? resolveUserId(props.user) : '')

  return ''
})

const { client } = useMatrixClient()
const roomOrUserUrl = computed(() => {
  if (room.value)
    return room.value
      ? props.direct || isDirectRoom(client.value, room.value)
        ? getDirectRoomAvatarUrl({ client: client.value, mxc: true, room: room.value })
        : (room.value.getMxcAvatarUrl() ?? undefined)
      : undefined

  if (userProfile.value) return userProfile.value.avatar_url

  return undefined
})

const resolvedAvatar = useResolveAvatarUrl(roomOrUserUrl, { size: props.imageSize })

const isError = ref(false)
watch(
  () => props.src ?? resolvedAvatar.value,
  url => {
    emits('url', url)
    isError.value = false
  },
  { immediate: true },
)

const placeholderName = computed(() => {
  if (props.placeholderKey) return props.placeholderKey
  if (room.value) return room.value.roomId
  if (props.user) return resolveUserId(props.user)
  if (props.src) return props.src
  return 'UNKNOWN'
})

const delegated = reactiveOmit(props, ['room', 'user', 'src', 'square', 'imageSize', 'placeholderKey', 'isLoading'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <Img
    v-if="(props.src || resolvedAvatar) && !isError"
    v-bind="forwarded"
    :key="props.src ?? resolvedAvatar"
    :alt
    :src="props.src ?? resolvedAvatar"
    :class="cn('object-cover', !square && 'rounded-full', props.class)"
    :do-placeholder="false"
    @error="isError = true"
    @url="console.log"
  />
  <AvatarPlaceholder
    v-else
    :is-loading
    :name="placeholderName"
    :square
    :class="cn(!square && 'rounded-full', 'size-full', props.class)"
  />
</template>
