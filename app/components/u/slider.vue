<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type USliderProps = SliderRootProps & { class?: HTMLAttributes['class'] }
export type USliderEmits = SliderRootEmits

const props = defineProps<USliderProps>()
const emits = defineEmits<USliderEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <SliderRoot
    :class="
      cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <SliderTrack
      class="rounded-full bg-muted grow relative overflow-hidden data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
    >
      <SliderRange
        class="bg-primary/85 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
      />
    </SliderTrack>
    <SliderThumb
      v-for="(_, key) in modelValue"
      :key="key"
      :class="
        cn(
          interactiveBase({ variant: 'default' }),
          'block size-4.5 cursor-pointer rounded-full bg-primary glow-primary hover:bg-primary',
        )
      "
    />
  </SliderRoot>
</template>
