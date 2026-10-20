<script setup lang="ts">
import type { ListboxFilterProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

import { useCommand } from './root.vue'

export type UCommandInputProps = ListboxFilterProps & {
  class?: HTMLAttributes['class']
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<UCommandInputProps>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)

const { filterState } = useCommand()
</script>

<template>
  <div class="px-4 border-b flex gap-2 h-12 items-center" cmdk-input-wrapper>
    <Icon :name="ICON__SEARCH" class="opacity-50 shrink-0 size-4 subpixel-antialiased" />
    <ListboxFilter
      v-bind="{ ...forwarded, ...$attrs }"
      v-model="filterState.search"
      auto-focus
      :class="
        cn(
          'mr-6 flex w-full text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
    />
  </div>
</template>
