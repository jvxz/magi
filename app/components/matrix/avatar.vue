<script lang="ts">
import type { ImgProps } from '~/components/img.vue'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'alt'> & {
  square?: boolean
  imageSize?: AvatarImageSize
} & (
  | { room: MaybeRoomOrId | undefined | null, user?: never, src?: never }
  | { user: MaybeUserOrId | undefined | null, room?: never, src?: never }
  | { src: string | undefined | null, room?: never, user?: never }
)
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<MatrixAvatarProps>(),
  {
    imageSize: 'small',
  },
)

const room = useRoom(() => props.room ?? undefined)
const userProfile = useUserProfile(() => props.user ?? undefined)

const src = computed(() => {
if (props.src) return props.src

  if (room.value)
    return room.value.getMxcAvatarUrl() ?? undefined

  if (userProfile.value)
    return userProfile.value.avatar_url

    return undefined
})

const resolvedAvatar = useResolveAvatarUrl(src, { size: props.imageSize })

const isError = ref(false)

const delegatedProps = reactiveOmit(props, 'room', 'user', 'src', 'square', 'imageSize')
</script>

<template>
  <Img
    v-if="resolvedAvatar"
    v-bind="delegatedProps"
    :key="resolvedAvatar"
    data-slot="avatar"
    :alt="userProfile?.displayname ? `${userProfile?.displayname}'s avatar` : 'Avatar'"
    :src="resolvedAvatar"
    :class="cn('object-cover', !square && 'rounded-full', props.class)"
    :do-placeholder="false"
    @error="isError = true"
  />
  <div v-else :class="cn('rounded-full bg-primary size-full', props.class)" />
</template>
