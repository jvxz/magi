export const useProfilePopover = createSharedComposable(() => {
  const open = shallowRef(false)
  const anchorElement = shallowRef<MaybeElement>()
  const userIdRef = shallowRef<string>()

  let currentEventRoot: MaybeElement
  whenever(() => !open.value, () => {
    currentEventRoot?.removeAttribute('data-popover-open')
    currentEventRoot = undefined
  })

  function openProfilePopover(trigger: MaybeElement, userId: string) {
    if (!trigger || open.value)
      return

    const eventRoot = trigger?.closest('[data-event-id]') as HTMLElement | null
    if (!eventRoot)
      return

    eventRoot.setAttribute('data-popover-open', '')
    currentEventRoot = eventRoot

    anchorElement.value = trigger
    open.value = true
    userIdRef.value = userId
  }

  const user = useUser(userIdRef)

  return {
    anchorElement,
    open,
    openProfilePopover,
    user,
  }
})
