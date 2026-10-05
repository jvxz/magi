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
const { openProfilePopover, triggerElement } = useProfilePopover()

let el: HTMLElement | undefined
const isOpen = computed(() => !!el && triggerElement.value === el)

function handleOpen(e: Event) {
  if (!props.user) return

  const currentTarget = e.currentTarget
  assert(
    currentTarget instanceof HTMLElement,
    '`currentTarget` was not an instance of an HTML element when handling open on profile popover trigger',
  )

  el = currentTarget
  openProfilePopover(currentTarget, resolveUserId(props.user), props.contentProps, props)
}
</script>

<template>
  <Primitive
    :as
    :as-child
    :type="as === 'button' ? 'button' : undefined"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    :data-state="isOpen ? 'open' : 'closed'"
    @click="handleOpen"
  >
    <slot />
  </Primitive>
</template>
