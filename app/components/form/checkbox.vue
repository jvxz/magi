<script lang="ts" setup>
import type { FormPrimitiveProps } from './primitive.vue'

const props = defineProps<FormPrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <FormPrimitive
    v-bind="delegated"
    :ui="{
      container: 'space-y-0 flex items-center gap-1 flex-row-reverse w-fit',
    }"
  >
    <UCheckbox class="" />

    <template #label="{ id }">
      <ULabel v-if="label" :for="id" :class="cn('text-xs gap-1', $props.ui?.label)">
        <span>{{ label }}</span>
        <span v-if="required" class="text-danger">*</span>
      </ULabel>
    </template>
  </FormPrimitive>
</template>
