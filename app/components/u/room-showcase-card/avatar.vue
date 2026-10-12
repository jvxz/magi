<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UShowcaseCardAvatarProps {
  class?: HTMLAttributes['class']
  room: MaybeRoomOrId | undefined
  manualAvatarSrc?: string | undefined
}

const props = defineProps<UShowcaseCardAvatarProps>()
const room = useRoom(() => props.room)

const isImageError = ref(false)
watch(
  () => [props.manualAvatarSrc, room.value?.roomId],
  () => (isImageError.value = false),
)

const avatarProps = computed(() => ({
  alt: props.room ? (isRoomId(props.room) ? props.room : props.room.name) : 'Room',
  class: 'rounded-sm shrink-0 w-fit aspect-square',
  square: true,
}))

const isJoined = useRoomIsJoined(room)

const isDirectInvite = useIsDirectInvite(room)
</script>

<template>
  <Slot data-slot="room-showcase-card-avatar">
    <Img
      v-if="!isImageError && manualAvatarSrc"
      :class="props.class"
      v-bind="avatarProps"
      :src="manualAvatarSrc"
      @error="isImageError = true"
    />
    <MatrixRoomAvatar
      v-else-if="!isImageError && (isJoined || isDirectInvite)"
      @error="isImageError = true"
      :class="props.class"
      :room
      :direct="isDirectInvite"
      v-bind="avatarProps"
    />
    <AvatarPlaceholder
      v-else
      :name="avatarProps.alt"
      :class="cn('rounded-sm shrink-0 w-fit aspect-square', props.class)"
    />
  </Slot>
</template>
