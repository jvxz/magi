<script lang="ts" setup>
import type { EditablePreviewProps } from 'reka-ui'

import { injectEditableRootContext } from 'reka-ui'

import { buttonVariants } from '../button.vue'
import { INJECTION_KEY__EDITABLE_AREA_ICONS } from './area.vue'

export type UEditablePreviewProps = EditablePreviewProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UEditablePreviewProps>()

const { modelValue } = injectEditableRootContext()
const { leadingIcon, trailingIcon } = inject(INJECTION_KEY__EDITABLE_AREA_ICONS)!

const delegated = reactiveOmit(props, ['class'])
</script>

<template>
  <EditablePreview
    v-bind="delegated"
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'text-base px-1 font-normal py-0 text-foreground underline decoration-dotted',
        props.class,
      )
    "
    data-slot="editable-preview"
  >
    <slot>
      <Icon v-if="leadingIcon" :name="leadingIcon" class="shrink-0" />
      <span class="truncate">{{ modelValue }}</span>
      <Icon v-if="trailingIcon" :name="trailingIcon" class="shrink-0" />
    </slot>
  </EditablePreview>
</template>
