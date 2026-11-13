<script lang="ts" setup>
import { useEmitAsProps } from 'reka-ui'

import type { MatrixAvatarEmits, MatrixAvatarProps } from './avatar.vue'

export interface UserAvatarProps extends Omit<MatrixAvatarProps, 'alt' | 'src'> {
  user: MaybeUserOrId | undefined | null
}
export interface UserAvatarEmits extends MatrixAvatarEmits {}

const props = defineProps<UserAvatarProps>()
const emits = defineEmits<UserAvatarEmits>()
const emitsAsProps = useEmitAsProps(emits)
const profile = useUserProfile(() => props.user ?? undefined)

const alt = computed(() =>
  profile.value?.displayname ? profile.value.displayname : props.user ? resolveUserId(props.user) : 'User',
)

const fallbackPlaceholderKey = useId()
const placeholderKey = computed(() =>
  isDefined(props.placeholderKey)
    ? props.placeholderKey
    : props.user
      ? resolveUserId(props.user)
      : fallbackPlaceholderKey,
)

const delegated = reactiveOmit(props, ['user', 'placeholderKey'])
</script>

<template>
  <MatrixAvatar
    v-bind="{ ...delegated, ...emitsAsProps }"
    :placeholder-key
    :alt
    :src="profile?.avatar_url"
    data-slot="user-avatar"
  />
</template>
