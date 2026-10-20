<script setup lang="ts">
import type { AlertDialogTitleProps } from 'reka-ui'

export type UAlertDialogTitleProps = AlertDialogTitleProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAlertDialogTitleProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogTitle v-bind="delegated" :class="cn('text-lg font-medium', props.class)">
    <slot />
  </AlertDialogTitle>
</template>
