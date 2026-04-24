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

  function openProfilePopover(trigger: MaybeElement, userId: string) {
    if (!trigger || open.value)
      return

    const eventRoot = trigger?.closest('[data-event-id]') as HTMLElement | null
    const root = eventRoot ?? trigger

    root.setAttribute('data-popover-open', '')
    currentRoot = root

    anchorElement.value = trigger
    open.value = true
    userIdRef.value = userId
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
