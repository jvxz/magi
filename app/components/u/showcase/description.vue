<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UShowcaseDescriptionProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UShowcaseDescriptionProps>(), { as: 'p' })

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('text-muted-foreground', props.class)">
    <slot />
  </Primitive>
</template>
