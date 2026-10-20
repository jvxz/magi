<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UShowcaseTitleProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UShowcaseTitleProps>(), {
  as: 'div',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex gap-3 items-center *:text-clip text-3xl font-semibold', props.class)">
    <slot />
  </Primitive>
</template>
