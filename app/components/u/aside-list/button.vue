<script lang="ts" setup>
import type { UButtonProps } from '~/components/u/button.vue'

export type UAsideListButtonProps = Omit<UButtonProps, 'variant'>

const props = defineProps<UAsideListButtonProps>()

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
