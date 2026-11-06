<script lang="ts" setup>
import type { ProgressRootEmits, ProgressRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UProgressRootProps = ProgressRootProps & { class?: string; progress: number }
export type UProgressRootEmits = ProgressRootEmits

const props = defineProps<UProgressRootProps>()
const emits = defineEmits<UProgressRootEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <ProgressRoot
    v-bind="forwarded"
    :class="cn('h-1em w-full bg-surface-raised rounded relative of-clip', props.class)"
    data-slot="progress-circle"
  >
    <ProgressIndicator
      class="bg-primary transition-all duration-75 inset-0 absolute"
      :style="{
        width: `${progress * 100}%`,
      }"
    />
  </ProgressRoot>
</template>
