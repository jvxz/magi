<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

import { UCardGroupItem, UCardRoot } from '#components'

import type { UCardGroupItemProps } from '../card-group/item.vue'

export interface URoomShowcaseCardRootProps extends PrimitiveProps, UCardGroupItemProps {
  room?: MaybeRoomOrId | undefined
  class?: string
  group?: boolean
}

const props = defineProps<URoomShowcaseCardRootProps>()

const room = useRoom(() => props.room)

const delegated = reactiveOmit(props, 'class', 'room')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <component
    :is="group ? UCardGroupItem : UCardRoot"
    v-bind="forwarded"
    variant="raised"
    :class="cn('flex-row', props.class)"
    data-slot="room-showcase-card-root"
  >
    <slot :room />
  </component>
</template>
