<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'

import { useCommand } from './root.vue'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')

const { filterState } = useCommand()
const isRender = computed(() => !!filterState.search && filterState.filtered.count === 0)
</script>

<template>
  <Primitive
    v-if="isRender"
    v-bind="delegated"
    :class="cn('peer py-5 text-center text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template>
