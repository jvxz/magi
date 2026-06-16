<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      room?: MaybeRoomOrId | undefined
      withAvatar?: boolean
      manualAvatarSrc?: string | undefined
      class?: string
    }
  >(),
  {
    withAvatar: true,
  },
)

const room = useRoom(() => props.room)

const avatarProps = computed(() => (props.manualAvatarSrc ? { src: props.manualAvatarSrc } : { room: room.value }))

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <UCard
    v-bind="forwarded"
    :class="
      cn(
        'w-full relative hover:(border-border-strong bg-hover) data-[context-menu-open]:(border-border-strong bg-hover) h-18 p-3.5 border flex-row gap-3.5',
        props.class,
      )
    "
  >
    <MatrixAvatar v-if="withAvatar" v-bind="avatarProps" square class="rounded-sm shrink-0 w-fit aspect-square" />
    <slot :room />
  </UCard>
</template>
