<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'
import type { PopoverContentProps, PrimitiveProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      user?: MaybeUserOrId | undefined
      contentProps?: PopoverContentProps
      freezeReference?: boolean
      manualRoom?: Room | undefined
      context?: ProfilePopoverContext
    }
  >(),
  { as: 'button' },
)
const { openProfilePopover } = useProfilePopover()

function handleOpen(e: Event) {
  if (!props.user) return

  const currentTarget = e.currentTarget
  assert(
    currentTarget instanceof HTMLElement,
    '`currentTarget` was not an instance of an HTML element when handling open on profile popover trigger',
  )

  openProfilePopover(currentTarget, resolveUserId(props.user), props.contentProps, props)
}
</script>

<template>
  <Primitive :as :as-child :type="as === 'button' ? 'button' : undefined" aria-haspopup="dialog" @click="handleOpen">
    <slot />
  </Primitive>
</template>
