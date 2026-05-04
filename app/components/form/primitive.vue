<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

export interface FormPrimitiveProps extends PrimitiveProps {
  label: string
  ui?: DefineClasses<'container' | 'label' | 'error' | 'footer'>
  required?: boolean
  error?: string | string[] | undefined
  isLoading?: boolean
}
</script>

<script lang="ts" setup>
const props = defineProps<FormPrimitiveProps>()

const id = useId()
const errorMessage = computed(() => {
  if (Array.isArray(props.error))
    return props.error[0]

  return props.error
})
</script>

<template>
  <Primitive v-bind="$props" :class="cn('space-y-1.5', $props.ui?.container)">
    <div class="flex size-fit w-full items-center justify-between">
      <ULabel
        :for="id"
        :class="cn('text-sm font-medium gap-1', $props.ui?.label)"
      >
        {{ label }}
        <span v-if="required" class="text-danger">*</span>
      </ULabel>
      <LazyUSpinner
        v-if="isLoading"
        class="shrink-0 size-4.5"
        :data-testid="`loading-spinner-${label}`"
      />
      <p
        v-else-if="errorMessage"
        :title="errorMessage"
        :class="cn('text-xs text-danger text-end max-w-2/3 truncate', $props.ui?.error)"
      >
        {{ errorMessage }}
      </p>
    </div>
    <Slot :id :data-error="errorMessage ? '' : undefined">
      <slot />
    </Slot>
    <div v-if="$slots.footer" :class="cn('text-xs text-muted-foreground text-end', $props.ui?.footer)">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
