<script lang="ts" setup>
import type { PopoverContentProps, PopoverTriggerProps } from 'reka-ui'

const props = defineProps<PopoverTriggerProps & {
  user: MaybeUserOrId
  contentProps?: PopoverContentProps
  freezeReference?: boolean
}>()
const { openProfilePopover } = useProfilePopover()

function handleOpen(e: Event) {
  const currentTarget = e.currentTarget
  assert(currentTarget instanceof HTMLElement, '`currentTarget` was not an instance of an HTML element when handling open on profile popover trigger')

  openProfilePopover(currentTarget, resolveUserId(props.user), props.contentProps, { freezeReference: props.freezeReference })
}
</script>

<template>
  <PopoverTrigger v-bind="$props" @click="handleOpen">
    <slot />
  </PopoverTrigger>
</template>
