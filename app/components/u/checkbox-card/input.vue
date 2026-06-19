<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & { class?: string }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="
      cn(
        checkboxVariants(),
        'pointer-events-none group-hover:group-not-active:border-border-strong! border shrink-0 ml-2',
        $props.class,
      )
    "
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="text-foreground flex size-full items-center justify-center absolute"
    >
      <Icon name="tabler:check" class="size-4/5" />
    </CheckboxIndicator>
  </Primitive>
</template>
