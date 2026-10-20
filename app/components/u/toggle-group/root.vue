<script setup lang="ts">
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui'

import { ToggleGroupRoot, useForwardPropsEmits } from 'reka-ui'
import { provide } from 'vue'

import type { ToggleVariants } from '../toggle.vue'

const props = withDefaults(
  defineProps<
    ToggleGroupRootProps & {
      class?: HTMLAttributes['class']
      variant?: ToggleVariants['variant']
      size?: ToggleVariants['size']
      spacing?: number
    }
  >(),
  {
    spacing: 0,
  },
)

const emits = defineEmits<ToggleGroupRootEmits>()

provide('toggleGroup', {
  size: props.size,
  spacing: props.spacing,
  variant: props.variant,
})

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToggleGroupRoot
    v-slot="slotProps"
    data-slot="toggle-group"
    :data-size="size"
    :data-variant="variant"
    :data-spacing="spacing"
    :style="{
      '--gap': spacing,
    }"
    v-bind="forwarded"
    :class="cn('group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded', props.class)"
  >
    <slot v-bind="slotProps" />
  </ToggleGroupRoot>
</template>
