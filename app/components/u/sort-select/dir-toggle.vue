<script lang="ts" setup>
import type { ButtonProps } from '../button.vue'

import { injectSortSelectContext } from './root.vue'

export type SortSelectDirToggleProps = ButtonProps

const props = withDefaults(defineProps<SortSelectDirToggleProps>(), {
  size: 'icon-sm',
  variant: 'outline',
})

const { modelValue } = injectSortSelectContext()

function toggle() {
  modelValue.value = {
    ...modelValue.value,
    dir: modelValue.value.dir === 'asc' ? 'desc' : 'asc',
  }
}
</script>

<template>
  <UButton
    type="button"
    data-slot="sort-select-dir-toggle"
    v-bind="props"
    :class="cn('rounded-l-0 peer-hover:border-l-transparent', props.class)"
    :aria-label="modelValue.dir === 'asc' ? 'Sort ascending' : 'Sort descending'"
    @click="toggle"
  >
    <slot>
      <Icon :name="modelValue.dir === 'asc' ? 'tabler:sort-ascending' : 'tabler:sort-descending'" />
    </slot>
  </UButton>
</template>
