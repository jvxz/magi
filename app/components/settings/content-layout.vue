<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('mt-12 flex gap-3.5 flex-col p-3.5 mx-auto max-w-screen-md', props.class)">
    <slot />
  </Primitive>
</template>
