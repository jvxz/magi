<script lang="ts" setup>
import type { EditableInputProps } from 'reka-ui'

import { injectEditableRootContext } from 'reka-ui'

import { INJECTION_KEY__EDITABLE_AREA_ICONS } from './area.vue'

export type UEditableInputProps = EditableInputProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UEditableInputProps>()

const { inputValue, isEditing } = injectEditableRootContext()
const { leadingIcon, trailingIcon, hideIconsWhenActive } = inject(INJECTION_KEY__EDITABLE_AREA_ICONS)!

const shouldShowIcons = computed(() => (hideIconsWhenActive.value ? false : isEditing.value))

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <span v-if="leadingIcon && shouldShowIcons" class="px-1 flex shrink-0 size-fit items-center justify-center">
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

  <span v-if="trailingIcon && shouldShowIcons" class="px-1 flex shrink-0 size-fit items-center justify-center">
    <Icon :name="trailingIcon" />
  </span>
</template>
