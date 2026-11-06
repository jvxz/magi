<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import type { UCardRootProps } from '../card/root.vue'

export interface UDialogUnsavedChangesProps extends UCardRootProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UDialogUnsavedChangesProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardRoot
    v-bind="delegated"
    :class="cn('absolute bottom-16 p-0 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded', props.class)"
    data-slot="dialog-unsaved-changes"
  >
    <slot />
  </UCardRoot>
</template>
