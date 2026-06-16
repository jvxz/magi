<script lang="ts" setup>
import type { CollapsibleTriggerProps } from 'reka-ui'

defineProps<CollapsibleTriggerProps>()
</script>

<template>
  <CollapsibleTrigger
    v-bind="$props"
    :class="
      cn(
        buttonVariants({ variant: 'ghost' }),
        'group py-2 flex-row gap-2 w-full justify-start data-[state=open]:(bg-selected hover:bg-selected) text-foreground',
        $attrs.class,
      )
    "
  >
    <slot />
  </CollapsibleTrigger>
</template>
