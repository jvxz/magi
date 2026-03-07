<script lang="ts" setup>
import { Slot } from 'reka-ui'

interface ButtonProps {
  asChild?: boolean
  disabled?: MaybeRefOrGetter<boolean>
  size?: 'default' | 'icon' | 'lg' | 'sm'
  variant?: 'default' | 'danger' | 'ghost' | 'link' | 'outline' | 'soft'
  class?: string
  isLoading?: MaybeRefOrGetter<boolean>
}

const props = defineProps<ButtonProps>()
</script>

<template>
  <Slot
    v-if="asChild"
    :disabled="toValue(disabled) || toValue(props.isLoading)"
    :class="cn(
      buttonVariants({ variant, size }),
      props.class,
      props.isLoading && 'grid text-transparent [grid-template-areas:stack]',
      toValue(disabled) && 'pointer-events-none',
    )"
  >
    <slot />
  </Slot>
  <button
    v-else
    :disabled="toValue(disabled) || toValue(props.isLoading)"
    :class="cn(
      buttonVariants({ variant, size }),
      props.class,
      toValue(props.isLoading) && 'not-[.spinner]:text-transparent',
      toValue(disabled) && 'pointer-events-none',
    )"
  >
    <USpinner
      v-if="toValue(props.isLoading)"
      :invert="true"
      class="inset-0 left-1/2 top-1/2 absolute !size-4.5 -translate-x-1/2 -translate-y-1/2"
    />
    <slot />
  </button>
</template>
