<script lang="ts" setup>
import type { EventType } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const rawProps = defineProps<PrimitiveProps & {
  class?: HTMLAttributes['class']
  dataEventType: EventType | string & {}
}>()

const { dataEventType, ...props } = rawProps
</script>

<template>
  <Primitive
    v-bind="props"
    :data-event-type="dataEventType"
    :class="cn('px-6 min-h-12 py-0.5 group hover:bg-card-2 shrink-0', $props.class)"
  >
    <slot />
  </Primitive>
</template>
