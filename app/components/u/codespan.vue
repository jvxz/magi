<script lang="ts" setup>
import type { UCardRootProps } from './card/root.vue'

export interface UCodespanProps extends Omit<UCardRootProps, 'variant'> {}

const props = withDefaults(defineProps<UCodespanProps>(), {
  as: 'code',
})

const delegated = reactiveOmit(props, ['class'])
</script>

<template>
  <UCardRoot
    v-bind="delegated"
    :class="
      cn(
        'text-sm bg-codeblock overflow-clip shadow-none p-0.75 px-1.5 inline leading-6.5 font-mono border-l overflow-x-auto',
        props.class,
      )
    "
    data-slot="codespan"
  >
    <slot />
  </UCardRoot>
</template>
