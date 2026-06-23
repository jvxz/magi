<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(
  defineProps<PrimitiveProps & { class?: string; withClose?: boolean; closeDisabled?: boolean }>(),
  { as: 'header', withClose: true },
)

const delegated = reactiveOmit(props, ['closeDisabled', 'withClose', 'class'])
</script>

<template>
  <Primitive v-bind="delegated" :class="cn('gap-1 mb-4 text-center sm:text-left flex flex-col', props.class)">
    <slot />
    <DialogClose v-if="withClose" as-child>
      <UButton
        variant="ghost"
        size="icon"
        class="opacity-70 inline-flex size-8 items-center right-3.5 top-3.5 justify-center absolute"
        :disabled="closeDisabled"
      >
        <Icon name="tabler:x" class="size-5" />
        <VisuallyHidden>Close</VisuallyHidden>
      </UButton>
    </DialogClose>
  </Primitive>
</template>
