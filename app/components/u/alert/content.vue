<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UAlertContentProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAlertContentProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex flex-col gap-1 flex-1', props.class)" data-slot="alert-content">
    <slot />
  </Primitive>
</template>
