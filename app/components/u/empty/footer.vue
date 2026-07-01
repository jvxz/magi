<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('flex items-center gap-2 justify-center pt-2', props.class)"
    data-slot="empty-footer"
  >
    <slot />
  </Primitive>
</template>
