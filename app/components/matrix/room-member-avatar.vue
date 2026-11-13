<script lang="ts" setup>
import type { RoomMember } from 'matrix-js-sdk'

import { useEmitAsProps } from 'reka-ui'

import type { MatrixAvatarEmits, MatrixAvatarProps } from './avatar.vue'

export interface RoomMemberAvatarProps extends Omit<MatrixAvatarProps, 'alt' | 'src'> {
  room: MaybeRoomOrId | undefined | null
  member: RoomMember | string
}
export interface RoomMemberAvatarEmits extends MatrixAvatarEmits {}

const props = defineProps<RoomMemberAvatarProps>()
const emits = defineEmits<RoomMemberAvatarEmits>()
const emitsAsProps = useEmitAsProps(emits)
const roomMember = useRoomMember(
  () => props.room ?? undefined,
  () => (isString(props.member) ? props.member : props.member.userId),
)

const alt = computed(() => resolveUserName(roomMember.value))

const placeholderKey = computed(() =>
  isDefined(props.placeholderKey) ? props.placeholderKey : resolveUserId(props.member),
)

const delegated = reactiveOmit(props, ['room', 'member', 'placeholderKey'])
</script>

<template>
  <MatrixAvatar
    v-bind="{ ...delegated, ...emitsAsProps }"
    :alt
    :placeholder-key
    :src="roomMember?.getMxcAvatarUrl()"
    data-slot="room-member-avatar"
  />
</template>
