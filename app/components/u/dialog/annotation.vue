<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UDialogAnnotationProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = withDefaults(defineProps<UDialogAnnotationProps>(), {
  as: 'p',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('text-muted-foreground text-sm mr-auto', props.class)">
    <slot />
  </Primitive>
</template>
