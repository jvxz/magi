<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { injectInputGroupRootContext } from './root.vue'

export interface UInputGroupFieldProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UInputGroupFieldProps>()
const modelValue = defineModel<string>('modelValue')

const { disabled } = injectInputGroupRootContext()
</script>

<template>
  <input
    v-model="modelValue"
    :disabled
    :tabindex="disabled ? -1 : undefined"
    :class="
      cn(
        'flex-1 px-2.5 min-w-0 not-first:ps-0 not-last:pe-0 bg-transparent outline-none disabled:(cursor-not-allowed caret-transparent)',
        props.class,
      )
    "
    data-slot="input-group-field"
  />
</template>
