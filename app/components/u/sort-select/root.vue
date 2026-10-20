<script lang="ts">
export type SortSelectOption = (typeof GENERAL__SORT_SELECT_OPTIONS)[number]
export type SortSelectDir = (typeof GENERAL__SORT_SELECT_DIRS)[number]

export interface SortSelectModelValue {
  option: SortSelectOption
  dir: SortSelectDir
}

export interface USortSelectRootProps {
  class?: HTMLAttributes['class']
  options?: SortSelectOption[]
  modelValue?: SortSelectModelValue
  defaultValue?: SortSelectModelValue
  disabled?: boolean
}

export interface SortSelectContext {
  options: Ref<SortSelectOption[]>
  modelValue: Ref<SortSelectModelValue>
}

export const [injectSortSelectContext, provideSortSelectContext] = createContext<SortSelectContext>('USortSelectRoot')
</script>

<script lang="ts" setup>
export interface USortSelectRootEmits {
  'update:modelValue': [value: SortSelectModelValue]
}

const props = withDefaults(defineProps<USortSelectRootProps>(), {
  defaultValue: () => ({ dir: 'asc', option: 'name' }),
  options: () => ['name', 'date-created'],
})

const emits = defineEmits<USortSelectRootEmits>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
}) as Ref<SortSelectModelValue>

const options = toRef(props, 'options')

provideSortSelectContext({ modelValue, options })

function setOption(value: unknown) {
  modelValue.value = { ...modelValue.value, option: value as SortSelectOption }
}
</script>

<template>
  <div data-slot="sort-select-root" :class="cn('flex items-center', props.class)">
    <USelectRoot :model-value="modelValue.option" :disabled="disabled" @update:model-value="setOption">
      <slot />
    </USelectRoot>
  </div>
</template>
