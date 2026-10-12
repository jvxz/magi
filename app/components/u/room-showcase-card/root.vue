<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

import { UCard, UCardGroupItem } from '#components'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      room?: MaybeRoomOrId | undefined
      withAvatar?: boolean
      manualAvatarSrc?: string | undefined
      class?: string
      alwaysShowAvatar?: boolean
      dynamicStyles?: boolean
      group?: boolean
    }
  >(),
  {
    dynamicStyles: false,
    withAvatar: true,
  },
)

const room = useRoom(() => props.room)

const delegated = reactiveOmit(props, 'class', 'room', 'withAvatar', 'manualAvatarSrc')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <component
    :is="group ? UCardGroupItem : UCard"
    v-bind="forwarded"
    variant="raised"
    :class="
      cn(
        'w-full relative h-13 border flex-row gap-3.5',
        dynamicStyles &&
          'hover:(border-border-strong bg-hover) data-[context-menu-open]:(border-border-strong bg-hover)',
        props.class,
      )
    "
    data-slot="room-showcase-card-root"
  >
    <slot :room />
  </component>
</template>
