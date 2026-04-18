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

const reducedMotion = usePreferredReducedMotion()

const { getAvatarUrl } = useUser()
const { data: avatarUrl } = getAvatarUrl(props.user, () => ({ animated: reducedMotion.value !== 'reduce' }))

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
    :key="avatarUrl"
    :alt="resolvedUser?.displayName ? `${resolvedUser?.displayName}'s avatar` : 'Avatar'"
    :src="avatarUrl"
    :class="cn(!square && 'rounded-full', props.class)"
  />
</template>
