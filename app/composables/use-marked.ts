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

    return cache.getOrInsert(
      `${options?.inline ? 'i' : 'o'}:${inputValue}`,
      DOMPurify.sanitize(
        options?.inline
          ? (md.parseInline(inputValue, { breaks: true }) as string)
          : (md.parse(inputValue, { breaks: true }) as string),
      ),
    )
  })
}
