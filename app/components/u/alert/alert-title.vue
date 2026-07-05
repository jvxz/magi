<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type AlertTitleProps = PrimitiveProps & { class?: string }

const props = defineProps<AlertTitleProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('font-medium', $props.class)" data-slot="alert-title">
    <slot />
  </Primitive>
</template>
