<script lang="ts" setup>
import type { PopoverContentProps, PopoverTriggerProps } from 'reka-ui'

const props = defineProps<PopoverTriggerProps & { user: MaybeUserOrId, contentProps?: PopoverContentProps }>()
const { anchorElement, contentProps, openProfilePopover } = useProfilePopover()

function handleOpen(e: Event) {
  const currentTarget = e.currentTarget
  assert(currentTarget instanceof HTMLElement, '`currentTarget` was not an instance of an HTML element when handling open on profile popover trigger')

  anchorElement.value = currentTarget
  contentProps.value = props.contentProps
  openProfilePopover(currentTarget, resolveUserId(props.user))
}
</script>

<template>
  <PopoverTrigger v-bind="$props" @click="handleOpen">
    <slot />
  </PopoverTrigger>
</template>
