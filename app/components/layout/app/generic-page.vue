<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps & {
  classes?: DefineClasses<'container' | 'shell'>
}>()
</script>

<template>
  <Primitive v-bind="$props" :class="cn('py-page-y-padding h-full relative overflow-y-scroll scrollbar-gutter-stable', $props.classes?.shell)">
    <div :class="cn('mx-auto container max-w-screen-xl space-y-lg', $props.classes?.container)">
      <slot />
    </div>
  </Primitive>
</template>
