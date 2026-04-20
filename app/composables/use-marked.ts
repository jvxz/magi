import { toRef } from '@vueuse/core'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

const md = marked.use({
  async: false,
  renderer: {
    strong: t => `<strong class="font-medium">${t.text}</strong>`,
  },
})

export function useMarked(input: MaybeRefOrGetter<string | undefined>) {
  const inputRef = toRef(input)

  return computed(() => {
    if (!inputRef.value)
      return

    return DOMPurify.sanitize(md.parse(inputRef.value) as string)
  })
}
