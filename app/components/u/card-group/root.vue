<script lang="ts" setup>
import type { UCardRootProps } from '../card/root.vue'

export interface UCardGroupRootProps extends UCardRootProps {
  ghost?: boolean
}

const props = withDefaults(defineProps<UCardGroupRootProps>(), {
  ghost: false,
  spacing: 'lg',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardRoot
    v-bind="delegated"
    :data-spacing="spacing"
    :class="cn('p-0 gap-0 of-clip', ghost && 'border-0 bg-transparent shadow-none', props.class)"
    data-slot="card-group-root"
  >
    <slot />
  </UCardRoot>
</template>
