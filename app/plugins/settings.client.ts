export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const settings = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS, { initOnMounted: true })

    return {
      provide: {
        settings,
      },
    }
  },
})
