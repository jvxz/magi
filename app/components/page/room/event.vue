<script lang="ts" setup>
import type { EventType, MatrixEvent } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { Primitive } from 'reka-ui'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes['class']
      event?: MatrixEvent | undefined
      eventType: EventType | string
      grouped?: boolean
      room: MaybeRoomOrId | undefined
    }
  >(),
  {
    as: 'div',
  },
)
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    data-testid="event-root"
    :data-event-id="event?.getId()"
    data-event
    :data-event-type="eventType"
    :class="
      cn(
        'px-6 data-[grouped=false]:mt-4.5 group hover:bg-hover data-[context-active]:bg-hover shrink-0 data-[grouped=true]:min-h-0',
        props.class,
      )
    "
    :data-grouped="grouped"
  >
    <slot />
  </Primitive>
</template>
