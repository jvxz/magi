import type { Room } from 'matrix-js-sdk'
import type { PopoverContentProps } from 'reka-ui'

export interface ProfilePopoverContext {
  from?: 'direct' | 'group'
}

export const useProfilePopover = createSharedComposable(() => {
  const open = shallowRef(false)
  const referenceElement = shallowRef<MaybeElement | VirtualElement>()
  const userIdRef = shallowRef<string>()
  const contentProps = shallowRef<PopoverContentProps>()
  const manualRoom = shallowRef<Room>()
  const context = shallowRef<ProfilePopoverContext>()

  let currentRoot: MaybeElement
  whenever(
    () => !open.value,
    () => {
      setPopoverOpenAttribute(currentRoot, 'remove')
      currentRoot = undefined

      setPopoverOpenAttribute(referenceElement.value, 'remove')
      referenceElement.value = undefined

      contentProps.value = undefined
      userIdRef.value = undefined
      manualRoom.value = undefined
      context.value = undefined
    },
  )

  function openProfilePopover(
    trigger: HTMLElement,
    userId: string,
    nextContentProps?: PopoverContentProps,
    options: { freezeReference?: boolean; manualRoom?: Room | undefined; context?: ProfilePopoverContext } = {},
  ) {
    const eventRoot = trigger.closest('[data-event-id]') as HTMLElement | null
    const root = eventRoot ?? trigger

    if (currentRoot && currentRoot !== root) setPopoverOpenAttribute(currentRoot, 'remove')

    if (options.manualRoom) manualRoom.value = options.manualRoom
    if (options.context) context.value = options.context

    setPopoverOpenAttribute(trigger, 'add')
    setPopoverOpenAttribute(root, 'add')

    currentRoot = root

    referenceElement.value = options.freezeReference ? createFrozenReference(trigger) : trigger

    contentProps.value = nextContentProps
    userIdRef.value = userId
    open.value = true
  }

  const user = useUser(userIdRef)

  return {
    contentProps,
    context,
    manualRoom,
    open,
    openProfilePopover,
    referenceElement,
    user,
  }
})

const POPOVER_OPEN_ATTRIBUTE_NAME = 'data-popover-open'
function setPopoverOpenAttribute(el: MaybeElement | VirtualElement, action: 'remove' | 'add') {
  if (!(el instanceof HTMLElement)) return

  if (action === 'add') {
    el.setAttribute(POPOVER_OPEN_ATTRIBUTE_NAME, '')
  } else el.removeAttribute(POPOVER_OPEN_ATTRIBUTE_NAME)
}
