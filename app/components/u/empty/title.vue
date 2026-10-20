<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UEmptyTitleProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UEmptyTitleProps>(), {
  as: 'h1',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('font-medium text-xl', props.class)" data-slot="empty-title">
    <slot />
  </Primitive>
</template>
