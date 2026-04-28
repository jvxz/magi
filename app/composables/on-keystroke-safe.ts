export const onKeyStrokeSafe = createSharedComposable((...params: Parameters<typeof onKeyStroke>) => {
  onKeyStroke((e) => {
    if (isFocusedElementEditable())
      return

    params[0](e)
  }, params[1])
})
