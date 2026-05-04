import { useHotkeys } from '@tanstack/vue-hotkeys'

export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const { open } = useSettingsDialog()

    useHotkeys([
      {
        callback: () => open.value = !open.value,
        hotkey: 'Mod+,',
      },
    ])
  },
})
