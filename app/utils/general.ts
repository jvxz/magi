export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export const getCurrentTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

export function toggleColorMode() {
  const colorMode = useColorMode()
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

export function onPaste(fn: (data: string | File) => void, options?: { disabled?: Ref<boolean> }) {
  const activeElement = useActiveElement()
  const isFocusedOnField = computed(
    () => activeElement.value?.tagName === 'INPUT' || activeElement.value?.tagName === 'TEXTAREA',
  )

  let text = ''
  let file: File | undefined

  function handlePaste(e: ClipboardEvent) {
    if (options?.disabled?.value || isFocusedOnField.value) return

    if (e.clipboardData) {
      if (e.clipboardData.files.length > 0) {
        file = e.clipboardData.files[0]
        if (file) fn(file)
      }

      text = e.clipboardData.getData('text')
      fn(text)
    }
  }

  onMounted(() => document.addEventListener('paste', handlePaste))
  onUnmounted(() => document.removeEventListener('paste', handlePaste))
}
