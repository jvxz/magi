<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UTableBodyProps {
  class?: HTMLAttributes['class']
  alternate?: boolean
}

const props = defineProps<UTableBodyProps>()
</script>

<template>
  <tbody
    :class="
      cn(
        'divide-y divide-border',
        alternate && [
          '*:even:group-data-[variant=default]/table:bg-surface-raised',
          '*:even:group-data-[variant=raised]/table:bg-surface-top',
          '*:even:group-data-[variant=top]/table:bg-surface-raised',
        ],
        props.class,
      )
    "
    data-slot="table-body"
  >
    <slot />
  </tbody>
</template>
