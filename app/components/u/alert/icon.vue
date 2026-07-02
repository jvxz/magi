<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

import { Icon } from '#components'

const props = defineProps<PrimitiveProps & { name: string; class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex shrink-0 h-full pt-0.75', $props.class)" data-slot="alert-icon">
    <Icon :name />
  </Primitive>
</template>
