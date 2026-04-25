import type { PopoverContentProps } from 'reka-ui'

export const useProfilePopover = createSharedComposable(() => {
  const open = shallowRef(false)
  const anchorElement = shallowRef<MaybeElement>()
  const userIdRef = shallowRef<string>()
  const contentProps = shallowRef<PopoverContentProps>()

  let currentRoot: MaybeElement
  whenever(() => !open.value, () => {
    currentRoot?.removeAttribute('data-popover-open')
    currentRoot = undefined
  })

  function openProfilePopover(trigger: MaybeElement, userId: string, nextContentProps?: PopoverContentProps) {
    if (!trigger)
      return

    const eventRoot = trigger.closest('[data-event-id]') as HTMLElement | null
    const root = eventRoot ?? trigger

    if (currentRoot && currentRoot !== root)
      currentRoot.removeAttribute('data-popover-open')

    root.setAttribute('data-popover-open', '')
    currentRoot = root

    anchorElement.value = trigger
    contentProps.value = nextContentProps
    userIdRef.value = userId
    open.value = true
  }

  const user = useUser(userIdRef)

  return {
    anchorElement,
    contentProps,
    open,
    openProfilePopover,
    user,
  }
})
