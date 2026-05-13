<script setup lang="ts">
import type { ComboboxItemEmits, ComboboxItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { AutocompleteItem, useForwardPropsEmits } from 'reka-ui'
import { cn, popoverStyles } from '#imports'

const props = defineProps<ComboboxItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ComboboxItemEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <AutocompleteItem
    data-slot="autocomplete-item"
    v-bind="forwarded"
    :class="cn(
      popoverItemBase(),
      'w-full gap-2 data-[highlighted]:bg-muted! data-[highlighted]:text-accent-foreground!',
      props.class,
    )"
  >
    <slot />
  </AutocompleteItem>
</template>
