<script lang="ts">
import type { ImgProps } from '~/components/img.vue'
import { User } from 'matrix-js-sdk'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'alt'> & {
  square?: boolean
  user: User | string | undefined
}
</script>

<script setup lang="ts">
const props = defineProps<MatrixAvatarProps>()

const { client } = useMatrixClient()

const { data: userProfile } = useUserProfile(() => typeof props.user === 'string' ? props.user : props.user?.userId)

const resolvedUser = computed(() => {
  if (!props.user)
    return undefined

  if (props.user instanceof User)
    return props.user

  return client.value.getUser(props.user)
})
</script>

<template>
  <Img
    v-bind="props"
    :key="userProfile?.avatar_url"
    :alt="resolvedUser?.displayName ? `${resolvedUser?.displayName}'s avatar` : 'Avatar'"
    :src="userProfile?.avatar_url"
    :class="cn(!square && 'rounded-full', props.class)"
  />
</template>
