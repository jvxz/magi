<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UShowcaseContentProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UShowcaseContentProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex flex-col gap-2', props.class)">
    <slot />
  </Primitive>
</template>
