<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export interface USettingHeaderProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<USettingHeaderProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('flex flex-col gap-1', props.class)" data-slot="setting-header">
    <slot />
  </Primitive>
</template>
