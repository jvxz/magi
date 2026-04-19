<script lang="ts">
import type { Room, User } from 'matrix-js-sdk'
import type { ImgProps } from '~/components/img.vue'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'alt'> & {
  square?: boolean
  room?: Room | undefined
  user: User | string | undefined
}
</script>

<script setup lang="ts">
const props = defineProps<MatrixAvatarProps>()

const userProfile = useUserProfile(() => typeof props.user === 'string' ? props.user : props.user?.userId)
const resolvedAvatar = useResolveAvatarUrl(() => userProfile.value?.avatar_url)

const isError = ref(false)
</script>

<template>
  <Img
    v-if="resolvedAvatar && !isError"
    v-bind="props"
    :key="resolvedAvatar"
    data-slot="avatar"
    :alt="userProfile?.displayname ? `${userProfile?.displayname}'s avatar` : 'Avatar'"
    :src="resolvedAvatar"
    :class="cn(!square && 'rounded-full', props.class)"
    @error="isError = true"
  />
  <div v-else class="rounded-full bg-primary size-full" />
</template>
