<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export interface USettingDescriptionProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<USettingDescriptionProps>(), {
  as: 'p',
})

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('text-sm text-muted-foreground', props.class)"
    data-slot="setting-description"
  >
    <slot />
  </Primitive>
</template>
