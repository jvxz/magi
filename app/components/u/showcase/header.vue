<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UShowcaseHeaderProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UShowcaseHeaderProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex flex-col gap-4 shrink-0', props.class)">
    <slot />
  </Primitive>
</template>
