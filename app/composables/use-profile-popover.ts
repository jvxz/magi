import type { PopoverContentProps } from 'reka-ui'

export const useProfilePopover = createSharedComposable(() => {
  const open = shallowRef(false)
  const referenceElement = shallowRef<MaybeElement | VirtualElement>()
  const userIdRef = shallowRef<string>()
  const contentProps = shallowRef<PopoverContentProps>()

  let currentRoot: MaybeElement
  whenever(() => !open.value, () => {
    currentRoot?.removeAttribute('data-popover-open')
    currentRoot = undefined
    referenceElement.value = undefined
    contentProps.value = undefined
    userIdRef.value = undefined
  })

  function openProfilePopover(
    trigger: HTMLElement,
    userId: string,
    nextContentProps?: PopoverContentProps,
    options: { freezeReference?: boolean } = {},
  ) {
    const eventRoot = trigger.closest('[data-event-id]') as HTMLElement | null
    const root = eventRoot ?? trigger

    if (currentRoot && currentRoot !== root)
      currentRoot.removeAttribute('data-popover-open')

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
