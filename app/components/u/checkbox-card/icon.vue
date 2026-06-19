<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<
  PrimitiveProps & {
    class?: string
  } & (
      | {
          name: string
          src?: never
          alt?: never
        }
      | {
          name?: never
          src: string
          alt: string
        }
    )
>()

const delegated = reactiveOmit(props, ['class', 'src', 'name', 'alt'])
const classProp = computed(() => cn('shrink-0', props.class))
</script>

<template>
  <Icon v-if="name" :name v-bind="delegated" :class="classProp" />
  <Img v-else :src :alt v-bind="delegated" :class="classProp" />
</template>
