<script setup lang="ts">
import type { AlertDialogCancelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonProps } from '../button.vue'

const props = withDefaults(
  defineProps<AlertDialogCancelProps & ButtonProps & { class?: HTMLAttributes['class'] }>(),
  { variant: 'ghost' },
)

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogCancel
    v-bind="delegatedProps"
    :class="cn(
      buttonVariants({
        variant,
        size,
      }),
      props.class,
    )"
  >
    <slot />
  </AlertDialogCancel>
</template>
