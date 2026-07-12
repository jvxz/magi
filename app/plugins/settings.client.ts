export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const settings = useScopedLocalStorage<Settings>('settings', DEFAULT_SETTINGS)

    // merge once on app load
    settings.value = merge(cloneDeep(DEFAULT_SETTINGS), settings.value)

    return {
      provide: {
        settings,
      },
    }
  },
})
