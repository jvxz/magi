<script setup lang="ts" generic="T">
import type { PrimitiveProps } from 'reka-ui'
import { Primitive, VisuallyHidden } from 'reka-ui'

const { data, loadingLabel, ...primitiveProps } = defineProps<PrimitiveProps & {
  data: T | null | undefined
  loadingLabel: string
}>()
</script>

<template>
  <Primitive v-bind="primitiveProps">
    <template v-if="data != null">
      <slot :data="data!" />
    </template>

    <template v-else>
      <VisuallyHidden>
        <span role="status">
          {{ loadingLabel }}
        </span>
      </VisuallyHidden>

      <slot name="skeleton" />
    </template>
  </Primitive>
</template>
