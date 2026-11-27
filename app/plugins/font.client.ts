export default defineNuxtPlugin({
  dependsOn: ['settings'],
  parallel: true,
  setup: () => {
    const settings = useSettings()

    useHead({
      htmlAttrs: { 'data-font': () => (settings.value.appearance.useSystem ? 'system' : undefined) },
    })
  },
})
