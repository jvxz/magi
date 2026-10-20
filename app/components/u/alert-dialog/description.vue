<script setup lang="ts">
import type { AlertDialogDescriptionProps } from 'reka-ui'

export type UAlertDialogDescriptionProps = AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAlertDialogDescriptionProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogDescription v-bind="delegated" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </AlertDialogDescription>
</template>
