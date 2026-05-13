<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: string
      variant?: VariantProps<typeof staticBase>['variant']
    }
  >(),
  {
    variant: 'default',
  },
)
</script>

<template>
  <Primitive
    v-bind="$props"
    data-slot="card"
    :class="cn(staticBase({ variant }), 'flex flex-col gap-5 shadow-lg', props.class)"
  >
    <slot />
  </Primitive>
</template>
