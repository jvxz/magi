<script setup lang="ts">
import type { AlertDialogDescriptionProps } from 'reka-ui'

const props = defineProps<AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogDescription v-bind="delegated" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </AlertDialogDescription>
</template>
