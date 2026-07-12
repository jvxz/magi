import { toRef } from '@vueuse/core'
import DOMPurify from 'dompurify'
import QuickLRU from 'quick-lru'

const md = MARKED_INSTANCE.use({
  async: false,
  renderer: {
    strong: t => `<strong class="font-medium">${t.text}</strong>`,
  },
})

const renderCache = new QuickLRU<string, string>({ maxSize: 512 })

export function useMarked(input: MaybeRefOrGetter<string | undefined>, options?: { inline?: boolean }) {
  const inputRef = toRef(input)

  return computed(() => {
    if (!inputRef.value) return

    const cacheKey = `${options?.inline ? 'i' : 'b'}:${inputRef.value}`
    const cached = renderCache.get(cacheKey)
    if (cached !== undefined) return cached

    const html = options?.inline
      ? md.parseInline(inputRef.value, { breaks: true })
      : md.parse(inputRef.value, { breaks: true })
    const sanitized = DOMPurify.sanitize(html as string)

    renderCache.set(cacheKey, sanitized)
    return sanitized
  })
}
