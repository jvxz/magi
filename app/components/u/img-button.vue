<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useForwardPropsEmits } from 'reka-ui'

export interface UImgButtonProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  visible?: boolean
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<UImgButtonProps>(), {
  as: 'button',
  icon: ICON__EDIT,
  visible: true,
})
const emits = defineEmits<{ action: Parameters<GlobalDialogMap['editAvatar']['onAction']> }>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated)

const { openDialog } = useGlobalDialog()
const handleClick = () => openDialog('editAvatar', { onAction: (url, file) => emits('action', url, file) })
</script>

<template>
  <Primitive
    v-if="visible"
    v-bind="forwarded"
    :class="cn('relative of-clip cursor-pointer group/img-button', props.class)"
    data-slot="img-button"
    @click="handleClick"
  >
    <slot />

    <div
      aria-hidden
      :class="
        cn(
          'absolute inset-0 size-full pointer-events-none invisible bg-hover-overlay group-hover/img-button:visible data-[state=loading]:visible ',
        )
      "
    >
      <div class="mx-auto grid size-full max-w-85% place-items-center">
        <Icon :name="icon" class="text-foreground size-40%" />
      </div>
    </div>
  </Primitive>

  <slot v-else />
</template>
