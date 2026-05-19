import type { CompactEmoji, MessagesDataset } from 'emojibase'

const VISIBLE_EMOJI_GROUPS = new Set(['0', '1', '3', '4', '5', '6', '7', '8', '9'])

const LOCALE_LOADER_MAP = {
  en: () => Promise.all([import('emojibase-data/en/compact.json'), import('emojibase-data/en/messages.json')]),
  ja: () => Promise.all([import('emojibase-data/ja/compact.json'), import('emojibase-data/ja/messages.json')]),
} as const

type SupportedLocale = keyof typeof LOCALE_LOADER_MAP

export const useEmojiData = createGlobalState(() => {
  // TODO: implement locale switching and loading
  const locale = shallowRef<SupportedLocale>('en')
  const targetLocale = computed(() => (locale.value in LOCALE_LOADER_MAP ? (locale.value as SupportedLocale) : 'en'))

  const isLoading = ref(false)

  const emojiData = shallowRef<{ emojis: CompactEmoji[]; messages: MessagesDataset } | null>(null)
  watch(
    targetLocale,
    async locale => {
      try {
        isLoading.value = true
        const [emojis, messages] = (await LOCALE_LOADER_MAP[locale]()) as [
          { default: CompactEmoji[] },
          { default: MessagesDataset },
        ]
        emojiData.value = { emojis: emojis.default, messages: messages.default }
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true },
  )

  const categories = computed(() => {
    if (!emojiData.value) return {}

    return Object.fromEntries(
      emojiData.value.messages.groups
        .filter(g => VISIBLE_EMOJI_GROUPS.has(g.order.toString()))
        .map(g => [g.order.toString(), { key: g.key, label: g.message }]),
    )
  })
  const groupedEmojis = computed(() => {
    if (!emojiData.value) return {}

    // resolve unknown groups to 'Symbols' category (group 8)
    return groupBy(emojiData.value?.emojis, e => (e.group ?? 8).toString())
  })

  return {
    categories,
    groupedEmojis,
    isLoading,
  }
})
