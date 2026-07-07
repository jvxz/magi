export const useRoomEventTimestampTooltip = createSharedComposable(() => {
  const open = shallowRef(false)
  const referenceElement = shallowRef<MaybeElement | VirtualElement>()
  const datetime = shallowRef<number>()

  function show(trigger: HTMLElement, next: number) {
    referenceElement.value = createFrozenReference(trigger)
    datetime.value = next
    open.value = true
  }

  function hide() {
    open.value = false
  }

  return {
    datetime,
    hide,
    open,
    referenceElement,
    show,
  }
})
