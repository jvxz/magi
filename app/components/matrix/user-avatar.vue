<script lang="ts" setup>
import { useEmitAsProps } from 'reka-ui'

import type { MatrixAvatarEmits, MatrixAvatarProps } from './avatar.vue'

export interface UserAvatarProps extends Omit<MatrixAvatarProps, 'alt' | 'src'> {
  user: MaybeUserOrId | undefined | null
}
export interface UserAvatarEmits extends MatrixAvatarEmits {}

const props = withDefaults(defineProps<UserAvatarProps>(), {
  doPlaceholder: true,
})
const emits = defineEmits<UserAvatarEmits>()
const emitsAsProps = useEmitAsProps(emits)
const profile = useUserProfile(() => props.user ?? undefined)

const alt = computed(() =>
  profile.value?.displayname ? profile.value.displayname : props.user ? resolveUserId(props.user) : 'User',
)

const delegated = reactiveOmit(props, 'user')
</script>

<template>
  <MatrixAvatar v-bind="{ ...delegated, ...emitsAsProps }" :alt :src="profile?.avatar_url" data-slot="user-avatar" />
</template>
