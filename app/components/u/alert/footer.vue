<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UAlertFooterProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAlertFooterProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('flex gap-1 items-center justify-end', props.class)"
    data-slot="alert-footer"
  >
    <slot />
  </Primitive>
</template>
