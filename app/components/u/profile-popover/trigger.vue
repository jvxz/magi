<script lang="ts" setup>
import type { PopoverTriggerProps } from 'reka-ui'

const props = defineProps<PopoverTriggerProps & { user: MaybeUserOrId }>()
const { anchorElement, openProfilePopover } = useProfilePopover()

function handleOpen(e: Event) {
  const currentTarget = e.currentTarget
  assert(currentTarget instanceof HTMLElement, '`currentTarget` was not an instance of an HTML element when handling open on profile popover trigger')

  anchorElement.value = currentTarget
  openProfilePopover(currentTarget, resolveUserId(props.user))
}
</script>

<template>
  <PopoverTrigger v-bind="$props" @click="handleOpen">
    <slot />
  </PopoverTrigger>
</template>
