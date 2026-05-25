interface RecentReaction {
  uses: number
  lastUsed: number
}

type RecentReactionState = Map<string, RecentReaction>

const initialValue = new Map(DEFAULT_RECENT_REACTIONS.map(e => [e, { lastUsed: 0, reaction: e, uses: 0 }]))

export const useRecentReactions = createGlobalState(() => {
  const recentReactions = useLocalStorage<RecentReactionState>('recentReactions', initialValue, {
    shallow: true,
  })

  const sortedRecentReactions = computed(() =>
    orderBy(
      Array.from(recentReactions.value, ([key, v]) => ({ key, ...v })),
      ['uses', 'lastUsed'],
      ['desc', 'desc'],
    ),
  )

  function bumpRecentReaction(reaction: Reaction) {
    const prev = recentReactions.value.get(reaction)

    recentReactions.value.set(reaction, {
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
