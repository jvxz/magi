<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

export interface UCardGroupItemDescriptionProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UCardGroupItemDescriptionProps>()
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardDescription
    v-bind="delegated"
    :class="cn('text-xs text-muted-foreground', props.class)"
    data-slot="card-group-item-description"
  >
    <slot />
  </UCardDescription>
</template>
