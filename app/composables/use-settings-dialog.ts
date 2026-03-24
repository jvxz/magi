export const useSettingsDialog = createGlobalState(() => {
  const open = shallowRef(false)

  return {
    open,
  }
})
