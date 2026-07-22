<script lang="ts" setup>
import type { UCardProps } from '../card/index.vue'

export interface UCardGroupRootProps extends UCardProps {}

const props = withDefaults(defineProps<UCardGroupRootProps>(), {
  spacing: 'lg',
})
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCard v-bind="delegated" :data-spacing="spacing" :class="cn('', props.class)" data-slot="card-group-root">
    <slot />
  </UCard>
</template>
