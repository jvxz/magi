<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'span',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('inline text-muted-foreground', props.class)">
    <slot> – </slot>
  </Primitive>
</template>
