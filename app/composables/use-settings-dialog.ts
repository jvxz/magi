export const useSettingsDialog = createGlobalState(() => {
  const open = shallowRef(false)
  const tab = shallowRef<SettingsCategory>(SETTINGS__DEFAULT_TAB)
  const searchQuery = shallowRef<string>('')

  return {
    open,
    searchQuery,
    tab,
  }
})
