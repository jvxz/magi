<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type USwitchProps = SwitchRootProps & { class?: HTMLAttributes['class']; variant?: StaticVariants['variant'] }
export type USwitchEmits = SwitchRootEmits

const props = defineProps<USwitchProps>()

const emits = defineEmits<USwitchEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="
      cn(
        staticBase({ variant }),
        'h-5.5 w-9 inline-flex p-0 shrink-0 items-center rounded-full border border-transparent outline-hidden transition-[background-color,border-color] reka-checked:(bg-primary border-transparent) ease-out duration-150 focus-visible:(outline-2 outline-solid outline-ring outline-offset-2)',
        props.class,
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          interactiveBase({ variant: 'default' }),
          'pointer-events-none block size-[calc(--spacing(4)-2px)] rounded-full border-0 bg-foreground ring-0 transition-transform ease-out data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5',
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
