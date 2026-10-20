<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UInlineSeparatorRootProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UInlineSeparatorRootProps>(), {
  as: 'span',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('inline text-muted-foreground', props.class)">
    <slot> – </slot>
  </Primitive>
</template>
