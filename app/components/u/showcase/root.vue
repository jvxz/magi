<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('mx-auto flex flex-col gap-4 max-w-generic-page-max-width', props.class)">
    <slot />
  </Primitive>
</template>
