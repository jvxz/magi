<script lang="ts" setup>
import type { EditableInputProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { injectEditableRootContext } from 'reka-ui'

import { editableAreaLeadingIconInjectionKey } from './area.vue'

export type UEditableInputProps = EditableInputProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UEditableInputProps>()

const { inputValue, isEditing } = injectEditableRootContext()
const leadingIcon = inject(editableAreaLeadingIconInjectionKey)

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <span v-if="leadingIcon && isEditing" class="px-1 flex shrink-0 size-fit items-center justify-center">
    <Icon :name="leadingIcon" />
  </span>

  <EditableInput
    v-bind="delegated"
    :class="cn('h-8 outline-none px-1 flex w-fit max-w-full field-sizing-content', props.class)"
    data-slot="editable-input"
  >
    <slot>
      {{ inputValue }}
    </slot>
  </EditableInput>
</template>
