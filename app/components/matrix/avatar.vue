<script lang="ts">
import type { Room } from 'matrix-js-sdk'
import type { ImgProps } from '~/components/img.vue'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'alt'> & {
  square?: boolean
  room?: Room | undefined
  user: MaybeUserOrId | undefined | null
  imageSize?: AvatarImageSize
}
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<MatrixAvatarProps>(),
  {
    imageSize: 'small',
  },
)

const userProfile = useUserProfile(() => typeof props.user === 'string' ? props.user : props.user?.userId)
const resolvedAvatar = useResolveAvatarUrl(() => userProfile.value?.avatar_url, { size: props.imageSize })

const isError = ref(false)
</script>

<template>
  <Img
    v-if="resolvedAvatar"
    v-bind="props"
    :key="resolvedAvatar"
    data-slot="avatar"
    :alt="userProfile?.displayname ? `${userProfile?.displayname}'s avatar` : 'Avatar'"
    :src="resolvedAvatar"
    :class="cn(!square && 'rounded-full', props.class)"
    :classes="{ img: 'object-cover' }"
    @error="isError = true"
    :do-placeholder="false"
  />
  <div v-else :class="cn('rounded-full bg-primary size-full', props.class)" />
</template>
