<script lang="ts">
import type { HTMLAttributes } from 'vue'

export interface InputGroupRootContext {
  disabled: Ref<boolean>
}

export const [injectInputGroupRootContext, provideInputGroupRootContext] =
  createContext<InputGroupRootContext>('UInputGroupRoot')
</script>

<script lang="ts" setup>
export interface UInputGroupRootProps {
  class?: HTMLAttributes['class']
  variant?: InputVariants['variant']
  divide?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<UInputGroupRootProps>(), { disabled: false })
provideInputGroupRootContext(toRefs(props))
</script>

<template>
  <fieldset
    :disabled
    :aria-disabled="disabled"
    :class="
      cn(
        inputStyles({ variant }),
        'flex items-stretch gap-0 p-0 cursor-text disabled:pointer-events-auto',
        divide && 'divide-x divide-border',
        props.class,
      )
    "
  >
    <slot />
  </fieldset>
</template>
