<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UAsideListRootProps = PrimitiveProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAsideListRootProps>()

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
