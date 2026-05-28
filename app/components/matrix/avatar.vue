<script lang="ts">
import type { ImgProps } from '~/components/img.vue'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'alt'> & {
  square?: boolean
  imageSize?: AvatarImageSize
  placeholderKey?: string
} & (
    | { room: MaybeRoomOrId | undefined | null; user?: never; src?: never }
    | { user: MaybeUserOrId | undefined | null; room?: never; src?: never }
    | { src: string | undefined | null; room?: never; user?: never }
  )
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<MatrixAvatarProps>(), {
  imageSize: 'small',
})

const room = useRoom(() => props.room ?? undefined)
const userProfile = useUserProfile(() => props.user ?? undefined)

const roomOrUserUrl = computed(() => {
  if (room.value) return room.value.getMxcAvatarUrl() ?? undefined

  if (userProfile.value) return userProfile.value.avatar_url

  return undefined
})

const resolvedAvatar = useResolveAvatarUrl(roomOrUserUrl, { size: props.imageSize })

const isError = ref(false)
watch(
  () => props.src ?? resolvedAvatar.value,
  () => (isError.value = false),
)

const delegatedProps = reactiveOmit(props, 'room', 'user', 'src', 'square', 'imageSize', 'placeholderKey')

const placeholderName = computed(() => {
  if (props.src) return props.src
  if (room.value) return room.value.roomId
  if (props.user) return resolveUserId(props.user)
  return props.placeholderKey ?? 'UNKNOWN'
})
</script>

<template>
  <Img
    v-if="(props.src || resolvedAvatar) && !isError"
    v-bind="delegatedProps"
    :key="props.src ?? resolvedAvatar"
    data-slot="avatar"
    :alt="userProfile?.displayname ? `${userProfile?.displayname}'s avatar` : 'Avatar'"
    :src="props.src ?? resolvedAvatar"
    :class="cn('object-cover', !square && 'rounded-full', props.class)"
    :do-placeholder="false"
    @error="isError = true"
  />
  <AvatarPlaceholder
    v-else
    :name="placeholderName"
    :square
    :class="cn(!square && 'rounded-full', 'bg-primary size-full', props.class)"
  />
</template>
