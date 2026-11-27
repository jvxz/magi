interface RecentReaction {
  uses: number
  lastUsed: number
}

type RecentReactionState = Map<Emoji['key'], RecentReaction>

const initialValue = new Map(
  GENERAL__DEFAULT_RECENT_REACTIONS.map(e => [getHexcodeFromUnicode(e), { lastUsed: 0, uses: 0 }]),
)

export const useRecentReactions = createGlobalState(() => {
  const recentReactions = useLocalStorage<RecentReactionState>('recentEmojis', initialValue, {
    shallow: true,
  })

  const sortedRecentReactions = computed(() =>
    orderBy(
      Array.from(recentReactions.value, ([key, v]) => ({ key, ...v })),
      ['uses', 'lastUsed'],
      ['desc', 'desc'],
    ),
  )

  function bumpRecentReaction(emojiKey: Emoji['key']) {
    const prev = recentReactions.value.get(emojiKey)

    recentReactions.value.set(emojiKey, {
      lastUsed: Date.now(),
      uses: (prev?.uses ?? 0) + 1,
    })

    triggerRef(recentReactions)
  }

  return {
    bumpRecentReaction,
    recentReactions,
    sortedRecentReactions,
  }
})

export function useRoomRecentReactions(roomIds: MaybeRefOrGetter<string[]>) {
  const { sortedRecentReactions } = useRecentReactions()
  const { getEmojiById } = useRoomEmoji(roomIds)

  return computed(() => sortedRecentReactions.value.map(r => getEmojiById(r.key)).filter(isDefined) as Emoji[])
}
