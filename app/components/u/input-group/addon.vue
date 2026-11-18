<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

export interface UInputGroupAddonProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UInputGroupAddonProps>()
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('px-2 h-full w-fit flex items-center text-muted-foreground text-xs', props.class)"
    data-slot="input-group-addon"
  >
    <slot />
  </Primitive>
</template>
