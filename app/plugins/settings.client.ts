export default defineNuxtPlugin({
  name: 'settings',
  parallel: true,
  setup: () => {
    const settings = useScopedLocalStorage<Settings>('settings', SETTINGS__DEFAULTS, {
      mergeDefaults: (stored, defaults) => merge(cloneDeep(defaults), stored),
    })

    return {
      provide: {
        settings,
      },
    }
  },
})
