<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { class?: string }>(), { as: 'p' })

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('text-xs text-muted-foreground truncate', $props.class)">
    <slot />
  </Primitive>
</template>
