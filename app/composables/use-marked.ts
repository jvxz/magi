import { toRef } from '@vueuse/core'
import DOMPurify from 'dompurify'

const md = MARKED_INSTANCE.use({
  async: false,
  renderer: {
    strong: t => `<strong class="font-medium">${t.text}</strong>`,
  },
})

export function useMarked(input: MaybeRefOrGetter<string | undefined>, options?: { inline?: boolean }) {
  const inputRef = toRef(input)

  return computed(() => {
    if (!inputRef.value) return

    const html = options?.inline
      ? md.parseInline(inputRef.value, { breaks: true })
      : md.parse(inputRef.value, { breaks: true })
    return DOMPurify.sanitize(html as string)
  })
}
