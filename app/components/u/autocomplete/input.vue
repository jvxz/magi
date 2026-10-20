<script setup lang="ts">
import type { AutocompleteInputEmits, AutocompleteInputProps } from 'reka-ui'

import { AutocompleteInput, useForwardPropsEmits } from 'reka-ui'

export type UAutocompleteInputProps = AutocompleteInputProps & {
  class?: HTMLAttributes['class']
  showIcon?: boolean
}
export type UAutocompleteInputEmits = AutocompleteInputEmits

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UAutocompleteInputProps>(), {
  class: '',
  showIcon: true,
})

const emits = defineEmits<UAutocompleteInputEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <div
    data-slot="autocomplete-input-wrapper"
    :class="
      cn(
        staticBase(),
        interactiveBase({ size: 'default' }),
        'flex items-center border-none gap-2 px-0 w-full',
        props.class,
      )
    "
  >
    <Icon v-if="props.showIcon" :name="ICON__SEARCH" class="opacity-50 shrink-0 size-4" />
    <AutocompleteInput
      data-slot="autocomplete-input"
      :class="cn('flex-1 outline-hidden border-none', props.class)"
      v-bind="{ ...$attrs, ...forwarded }"
    >
      <slot />
    </AutocompleteInput>
  </div>
</template>
