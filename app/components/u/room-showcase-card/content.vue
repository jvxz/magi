<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type URoomShowcaseCardContentProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<URoomShowcaseCardContentProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex w-full justify-between gap-3.5', props.class)">
    <slot />
  </Primitive>
</template>
