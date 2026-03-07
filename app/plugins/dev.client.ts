export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    if (!import.meta.env.DEV)
      return

    const keys = useMagicKeys()
    // @ts-expect-error - keys.shift_t is not typed
    whenever(keys.shift_t, toggleColorMode)
  },
})
