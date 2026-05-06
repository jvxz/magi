<script lang="ts" setup>
import type { NuxtTimeProps } from '#app'
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { datetime: number }>()

const isOld = computed(() => {
  const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 })
  const eventDate = Temporal.Instant.fromEpochMilliseconds(props.datetime).toZonedDateTimeISO('UTC').toPlainDate()

  return Temporal.PlainDate.compare(eventDate, yesterday) <= 0
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
</script>

<template>
  <Primitive v-bind="$props" :class="cn('text-xs text-muted-foreground select-none', $attrs.class)">
    <UTooltipRoot :delay-duration="1000">
      <UTooltipTrigger as-child>
        <NuxtTime v-bind="nuxtTimeProps" />
      </UTooltipTrigger>
      <UTooltipContent>
        <NuxtTime
          :datetime
          weekday="long"
          month="long"
          day="numeric"
          year="numeric"
          hour="numeric"
          minute="numeric"
        />
      </UTooltipContent>
    </UTooltipRoot>
  </Primitive>
</template>
