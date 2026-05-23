<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

withDefaults(defineProps<PrimitiveProps & { withClose?: boolean }>(), { as: 'header', withClose: true })
</script>

<template>
  <Primitive
    v-bind="$props"
    :class="
      cn(
        'gap-2 text-center sm:text-left pe-2.5 ps-4 border-b flex shrink-0 h-header-height items-center justify-between',
        $attrs.class,
      )
    "
  >
    <slot />
    <DialogClose
      v-if="withClose"
      :class="
        cn(
          interactiveBase({ variant: 'ghost', size: 'icon' }),
          'inline-flex size-8 items-center justify-center opacity-70',
        )
      "
    >
      <Icon name="tabler:x" class="size-5" />
      <VisuallyHidden>Close</VisuallyHidden>
    </DialogClose>
  </Primitive>
</template>
