import DOMPurify from 'dompurify'
import QuickLRU from 'quick-lru'

const md = MARKED_INSTANCE.use({
  async: false,
  renderer: {
    strong: t => `<strong class="font-medium">${t.text}</strong>`,
  },
})

const cache = new QuickLRU<string, string>({ maxSize: 512 })

export function useMarked(input: MaybeRefOrGetter<string | undefined>, options?: { inline?: boolean }) {
  return computed(() => {
    const inputValue = toValue(input)
    if (!inputValue) return

    const key = getKey(inputValue)

    const cached = cache.get(key)
    if (cached) return cached

    const content = DOMPurify.sanitize(
      options?.inline
        ? (md.parseInline(inputValue, { breaks: true }) as string)
        : (md.parse(inputValue, { breaks: true }) as string),
    )

    cache.set(key, content)

    return content
  })

  function getKey(input: string) {
    return `${options?.inline ? 'i' : 'o'}:${input}`
  }
}
