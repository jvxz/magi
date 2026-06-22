<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { class?: string }>(), { as: 'header', withClose: true })

const delegated = reactiveOmit(props, ['class'])
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('gap-1 mb-4 text-center sm:text-left flex flex-col', props.class)">
    <slot />
  </Primitive>
</template>
