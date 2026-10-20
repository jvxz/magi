<script setup lang="ts">
import type { AlertDialogActionProps } from 'reka-ui'

import type { ButtonProps } from '../button.vue'

import { buttonVariants } from '../button.vue'

const props = defineProps<AlertDialogActionProps & ButtonProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogAction v-bind="delegated" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </AlertDialogAction>
</template>
