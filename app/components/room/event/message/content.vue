<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()

const delegated = (props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex-1  ', props.class)">
    <div v-if="$slots.header" class="text-sm font-medium flex gap-2 items-center">
      <slot name="header" />
    </div>
    <slot />
  </Primitive>
</template>
