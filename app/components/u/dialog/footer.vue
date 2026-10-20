<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UDialogFooterProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UDialogFooterProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4 w-full', props.class)"
    data-slot="dialog-footer"
  >
    <slot />
  </Primitive>
</template>
