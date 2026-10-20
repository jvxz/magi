<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UEmptyRootProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UEmptyRootProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex flex-col gap-2 items-center', props.class)">
    <slot />
  </Primitive>
</template>
