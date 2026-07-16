<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string; variant?: AlertVariants; icon?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn(alertVariants({ variant }), 'flex p-4 gap-2', props.class)"
    data-slot="alert-root"
  >
    <slot />
  </Primitive>
</template>
