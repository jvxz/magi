<script lang="ts">
// module scoped, shared across components
const yesterdayDate = computed(() => Temporal.Now.plainDateISO().subtract({ days: 1 }))
const localTimeZoneId = computed(() => Temporal.Now.timeZoneId())
</script>

<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

import type { NuxtTimeProps } from '#app'

const props = defineProps<PrimitiveProps & { datetime: number; class?: string }>()

const isOld = computed(() => {
  const eventDate = Temporal.Instant.fromEpochMilliseconds(props.datetime)
    .toZonedDateTimeISO(localTimeZoneId.value)
    .toPlainDate()

  return Temporal.PlainDate.compare(eventDate, yesterdayDate.value) <= 0
})

const nuxtTimeProps = computed<NuxtTimeProps>(() => {
  if (isOld.value) {
    return {
      datetime: props.datetime,
    }
  }

  return {
    datetime: props.datetime,
    hour: 'numeric',
    minute: 'numeric',
  }
})

const { hide, show } = useRoomEventTimestampTooltip()
const { start, stop } = useTimeoutFn((el: HTMLElement) => show(el, props.datetime), 700, { immediate: false })

function onEnter(e: PointerEvent) {
  start(e.currentTarget as HTMLElement)
}
function onLeave() {
  stop()
  hide()
}
</script>

<template>
  <Primitive
    v-bind="props"
    :class="cn('text-xs text-muted-foreground select-none', props.class)"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @focus="show($event.currentTarget as HTMLElement, props.datetime)"
    @blur="hide"
  >
    <NuxtTime v-bind="nuxtTimeProps" />
  </Primitive>
</template>
