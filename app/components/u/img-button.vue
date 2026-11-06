<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useForwardPropsEmits } from 'reka-ui'

export interface UImgButtonProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  visible?: boolean
  icon?: string
  progress?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<UImgButtonProps>(), {
  as: 'button',
  visible: true,
})
const emits = defineEmits<{ click: MouseEvent }>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <Primitive
    v-if="visible"
    v-bind="forwarded"
    :class="cn('relative of-clip cursor-pointer group/img-button', props.class)"
    data-slot="img-button"
  >
    <slot />

    <div
      aria-hidden
      :data-state="isDefined(progress) ? 'loading' : 'idle'"
      :class="
        cn(
          'absolute inset-0 size-full pointer-events-none invisible bg-hover-overlay group-hover/img-button:visible data-[state=loading]:visible ',
        )
      "
    >
      <div class="mx-auto grid size-full max-w-85% place-items-center">
        <Icon v-if="isNil(progress) && icon" :name="icon" class="text-foreground size-40%" />
        <UProgressBar v-else-if="isDefined(progress)" :progress class="text-2xs" />
      </div>
    </div>
  </Primitive>

  <slot v-else />
</template>
