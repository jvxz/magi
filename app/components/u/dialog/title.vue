<script setup lang="ts">
import type { DialogTitleProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <DialogTitle v-bind="forwarded" :class="cn('text-lg leading-none font-medium', props.class)">
    <slot />
  </DialogTitle>
</template>
