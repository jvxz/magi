<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export interface UAlertDescriptionProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UAlertDescriptionProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('text-sm', props.class)" data-slot="alert-description">
    <slot />
  </Primitive>
</template>
