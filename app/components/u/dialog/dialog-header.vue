<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

withDefaults(defineProps<PrimitiveProps & { withClose?: boolean }>(), { as: 'header', withClose: true })
</script>

<template>
  <Primitive v-bind="$props" :class="cn('gap-1 mb-4 text-center sm:text-left flex flex-col', $attrs.class)">
    <slot />
    <DialogClose
      v-if="withClose"
      :class="
        cn(
          interactiveBase({ variant: 'ghost', size: 'icon' }),
          ' absolute right-3.5 top-3.5 inline-flex size-8 items-center justify-center opacity-70',
        )
      "
    >
      <Icon name="tabler:x" class="size-5" />
      <VisuallyHidden>Close</VisuallyHidden>
    </DialogClose>
  </Primitive>
</template>
