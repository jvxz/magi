<script lang="ts" setup>
import type { MatrixRoomAvatarProps } from '~/components/matrix/room-avatar.vue'

export type UShowcaseAvatarProps = MatrixRoomAvatarProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UShowcaseAvatarProps>(), { square: true })

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <MatrixRoomAvatar v-bind="delegated" :class="cn('rounded shrink-0 size-10', props.class)" />
</template>
