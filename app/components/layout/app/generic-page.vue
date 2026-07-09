<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<
  PrimitiveProps & {
    classes?: DefineClasses<'container' | 'shell'>
    class?: string
  }
>()

const delegated = reactiveOmit(props, ['class', 'classes'])
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('py-page-y-padding h-full relative overflow-y-scroll scrollbar-gutter-stable', props.classes?.shell)"
  >
    <div
      :class="cn('mx-auto container max-w-generic-page-max-width space-y-lg', props.class, props.classes?.container)"
    >
      <slot />
    </div>
  </Primitive>
</template>
