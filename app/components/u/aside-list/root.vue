<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn('p-2.5 flex flex-col gap-[2px] w-full *:w-full *:justify-start', props.class)"
    data-slot="aside-list-root"
  >
    <slot />
  </Primitive>
</template>
