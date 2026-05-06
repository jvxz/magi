export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const settings = useLocalStorage<Settings>('settings', DEFAULT_SETTINGS)

    return {
      provide: {
        settings,
      },
    }
  },
})
