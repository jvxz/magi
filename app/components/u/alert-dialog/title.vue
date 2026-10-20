<script setup lang="ts">
import type { AlertDialogTitleProps } from 'reka-ui'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AlertDialogTitle v-bind="delegatedProps" :class="cn('text-lg font-medium', props.class)">
    <slot />
  </AlertDialogTitle>
</template>
