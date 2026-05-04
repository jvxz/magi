const defaults = v.getDefaults(SettingsSchema)

export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const settings = useLocalStorage('settings', {
      ...defaults,
      events: {
        toggledEventTypes: [...defaults.events.toggledEventTypes],
      },
    }, { initOnMounted: true })

    return {
      provide: {
        settings,
      },
    }
  },
})
