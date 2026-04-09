<script lang="ts" setup>
import type { EventType } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

defineProps<PrimitiveProps & {
  class?: HTMLAttributes['class']
  eventId: string | undefined
  eventType: EventType | string
}>()
</script>

<template>
  <Primitive
    v-bind="$props"
    :data-event-id="eventId"
    :data-event-type="eventType"
    :class="cn('px-6 min-h-12 py-0.5 group hover:bg-card-2 shrink-0', $props.class)"
  >
    <slot />
  </Primitive>
</template>
