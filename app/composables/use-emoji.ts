interface EmojiBase {
  key: string
  label: string
  terms: string
}

export type Emoji =
  | (EmojiBase & { type: 'unicode'; unicode: string; hexcode: string; shortcodes: string[]; group: number })
  | (EmojiBase & { type: 'custom'; url: string; packId: string; body?: string; shortcode: string })

export const useEmoji = createGlobalState(() => {
  const { allEmojiPacks } = useUserImagePacks()
  const { emojiData } = useEmojibase()

  const account = computed(() => allEmojiPacks.value.flatMap(fromImagePack))
  const unicode = computed(() => emojiData.value?.emojis.map(fromCompactEmoji) ?? [])

  const accountByShortcode = computed(() => emojiListToMap(account.value))

  const unicodeByShortcode = computed(() => emojiListToMap(unicode.value))
  const unicodeByGroup = computed(() => groupBy(unicode.value, e => e.group.toString()))

  return { account, accountByShortcode, unicode, unicodeByGroup, unicodeByShortcode }
})
