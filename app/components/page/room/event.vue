<script lang="ts" setup>
import type { EventType } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

defineProps<PrimitiveProps & {
  class?: HTMLAttributes['class']
  eventId: string | undefined
  eventType: EventType | string
  grouped?: boolean
}>()
</script>

<template>
  <Primitive
    v-bind="$props"
    data-testid="event-root"
    :data-event-id="eventId"
    :data-event-type="eventType"
    :class="cn('px-6 data-[grouped=false]:mt-4.5 group hover:bg-card-lighter data-[popover-open]:bg-card-lighter shrink-0 group data-[grouped=true]:min-h-0', $props.class)"
    :data-grouped="grouped"
  >
    <slot />
  </Primitive>
</template>
