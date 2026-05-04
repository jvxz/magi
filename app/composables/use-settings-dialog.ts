export const useSettingsDialog = createGlobalState(() => {
  const open = shallowRef(false)
  const tab = shallowRef<SettingsCategory>(SETTINGS_DEFAULT_TAB)

  return {
    open,
    tab,
  }
})
