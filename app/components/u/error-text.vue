<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export interface ErrorTextProps extends PrimitiveProps {
  class?: string
  withTooltip?: boolean
  error: Error | undefined | null | (Error | undefined | null)[]
}

const props = withDefaults(defineProps<ErrorTextProps>(), {
  as: 'p',
  withTooltip: true,
})

const delegated = reactiveOmit(props, 'class')
const parsedError = computed(() => {
  const err = Array.isArray(props.error) ? compact(props.error)[0] : props.error
  if (!err) return

  return parseError(err)
})

const textClass = computed(() => cn('text-sm text-danger truncate', props.class))

const content = computed(
  () => `${parsedError.value?.title ? `[${parsedError.value?.title}] ` : ''}${parsedError.value?.message}`,
)
</script>

<template>
  <template v-if="parsedError">
    <slot v-if="!withTooltip">
      <Primitive v-bind="delegated" :class="textClass" data-slot="error-text">
        {{ content }}
      </Primitive>
    </slot>

    <UTooltipRoot v-else>
      <UTooltipTrigger as-child>
        <slot>
          <Primitive v-bind="delegated" :class="textClass" data-slot="error-text">
            {{ content }}
          </Primitive>
        </slot>
      </UTooltipTrigger>

      <UTooltipContent>
        {{ content }}
      </UTooltipContent>
    </UTooltipRoot>
  </template>
</template>
