<script lang="ts" setup>
import type { Icon } from '#components'

export interface UShowcaseIconProps {
  class?: HTMLAttributes['class']
  name: string
}

const props = defineProps<UShowcaseIconProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Icon v-bind="delegated" :class="cn('', props.class)" data-slot="showcase-icon">
    <slot />
  </Icon>
</template>
