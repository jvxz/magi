<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import type { UCardRootProps } from '../card/root.vue'

export interface UDialogUnsavedChangesProps extends UCardRootProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UDialogUnsavedChangesProps>()

const delegated = reactiveOmit(props, 'class')

const card = useTemplateRef('card')
let flash: Animation | undefined

const animatePrevent = () => {
  const el = card.value?.$el as HTMLElement | undefined
  if (!el) return

  flash ??= el.animate([{ borderColor: 'var(--danger)' }, {}], { duration: 1000, easing: 'linear' })
  flash.currentTime = 0
  flash.play()
}

defineExpose({ animatePrevent })
</script>

<template>
  <UCardRoot
    v-bind="delegated"
    ref="card"
    :class="cn('absolute bottom-4 p-0 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded', props.class)"
    data-slot="dialog-unsaved-changes"
  >
    <slot />
  </UCardRoot>
</template>
