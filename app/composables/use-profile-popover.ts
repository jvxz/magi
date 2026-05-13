import type { Room } from 'matrix-js-sdk'
import type { PopoverContentProps } from 'reka-ui'

export const useProfilePopover = createSharedComposable(() => {
  const open = shallowRef(false)
  const referenceElement = shallowRef<MaybeElement | VirtualElement>()
  const userIdRef = shallowRef<string>()
  const contentProps = shallowRef<PopoverContentProps>()
  const manualRoom = shallowRef<Room>()

  let currentRoot: MaybeElement
  whenever(
    () => !open.value,
    () => {
      currentRoot?.removeAttribute('data-popover-open')
      currentRoot = undefined
      referenceElement.value = undefined
      contentProps.value = undefined
      userIdRef.value = undefined
      manualRoom.value = undefined
    },
  )

  function openProfilePopover(
    trigger: HTMLElement,
    userId: string,
    nextContentProps?: PopoverContentProps,
    options: { freezeReference?: boolean; manualRoom?: Room | undefined } = {},
  ) {
    const eventRoot = trigger.closest('[data-event-id]') as HTMLElement | null
    const root = eventRoot ?? trigger

    if (currentRoot && currentRoot !== root) currentRoot.removeAttribute('data-popover-open')

    if (options.manualRoom) manualRoom.value = options.manualRoom

    root.setAttribute('data-popover-open', '')
    currentRoot = root

    referenceElement.value = options.freezeReference ? createFrozenReference(trigger) : trigger

    contentProps.value = nextContentProps
    userIdRef.value = userId
    open.value = true
  }

  const user = useUser(userIdRef)

  return {
    contentProps,
    manualRoom,
    open,
    openProfilePopover,
    referenceElement,
    user,
  }
})

function createFrozenReference(trigger: HTMLElement): VirtualElement {
  const rect = trigger.getBoundingClientRect()

  return {
    contextElement: trigger,
    getBoundingClientRect: () => rect,
  }
}
