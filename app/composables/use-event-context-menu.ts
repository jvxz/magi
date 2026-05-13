export const useEventContextMenu = createSharedComposable(() => {
  const open = shallowRef(false)

  return {
    open,
  }
})
