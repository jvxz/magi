<script lang="ts">
import type { ToggleVariants } from '../toggle.vue'

export const INJECTION_KEY__TOGGLE_GROUP: InjectionKey<ToggleVariants & { spacing?: number }> = Symbol('toggle-group')
</script>

<script setup lang="ts">
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui'

import { ToggleGroupRoot, useForwardPropsEmits } from 'reka-ui'
import { provide } from 'vue'

export type UToggleGroupRootProps = ToggleGroupRootProps & {
  class?: HTMLAttributes['class']
  variant?: ToggleVariants['variant']
  size?: ToggleVariants['size']
  spacing?: number
}
export type UToggleGroupRootEmits = ToggleGroupRootEmits

const props = withDefaults(defineProps<UToggleGroupRootProps>(), {
  spacing: 0,
})

const emits = defineEmits<UToggleGroupRootEmits>()

provide(INJECTION_KEY__TOGGLE_GROUP, {
  size: props.size,
  spacing: props.spacing,
  variant: props.variant,
})

const delegated = reactiveOmit(props, 'class', 'size', 'variant')
const forwarded = useForwardPropsEmits(delegated, emits)
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
