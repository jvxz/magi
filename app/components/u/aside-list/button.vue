<script lang="ts" setup>
import type { ButtonProps } from '~/components/u/button.vue'

const props = defineProps<Omit<ButtonProps, 'variant'>>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UButton
    v-bind="delegated"
    variant="ghost"
    :class="
      cn(
        'text-sm w-full justify-start',
        'data-[state=off]:(hover:text-foreground hover:bg-hover) router-link-active:(bg-selected hover:bg-selected text-foreground)',
        props.class,
      )
    "
  >
    <slot />
  </UButton>
</template>
