import type { Room } from 'matrix-js-sdk'

export function useRoomEmoji(roomIds: MaybeRefOrGetter<string[]>) {
  const { client } = useMatrixClient()
  const { getRevision } = useRoomRevisions()
  const { account, unicode } = useEmoji()
  const { allEmojiPacks } = useUserImagePacks()

  const roomPacks = computed(() => {
    for (const id of toValue(roomIds)) {
      void getRevision(id)
    }

    const rooms = toValue(roomIds)
      .map(id => getRoom(client.value, id))
      .filter(isDefined) as Room[]

    const imagePackEvents = rooms.flatMap(getRoomImagePacks)
    const formattedPacks = imagePackEvents.map(e => formatImagePack(e)).filter(isDefined) as ImagePack[]
    return formattedPacks.filter(p => !p.usage?.length || p.usage.includes('emoticon'))
  })

  const roomEmojis = computed(() => roomPacks.value.flatMap(fromImagePack))

  // skip account packs already shown as room packs
  const packs = computed(() => {
    const roomPackIds = new Set(roomPacks.value.map(p => p.id))
    return [...roomPacks.value, ...allEmojiPacks.value.filter(p => !roomPackIds.has(p.id))]
  })

  const allEmojis = computed(() => {
    const seen = new Set<string>()
    const emojis: Emoji[] = []
    for (const e of [...roomEmojis.value, ...account.value, ...unicode.value]) {
      if (seen.has(e.key)) continue
      seen.add(e.key)
      emojis.push(e)
    }
    return emojis
  })

  const emojiMap = computed(() => emojiListToMap(allEmojis.value))

  const getEmojiById = (id: string) => emojiMap.value.get(id)

  const getEmojisByShortcode = (shortcode: string) => {
    const arr: Emoji[] = []
    for (const emoji of allEmojis.value) {
      if (emoji.type === 'unicode' && emoji.shortcodes.includes(shortcode)) {
        arr.push(emoji)
      } else if (emoji.type === 'custom' && emoji.shortcode === shortcode) {
        arr.push(emoji)
      }
    }
    return arr
  }

  const reactionMap = computed(() => {
    const map = new Map<Reaction, Emoji>()
    for (const emoji of allEmojis.value) {
      const reaction = emoji.type === 'unicode' ? emoji.unicode : emoji.url
      if (!map.has(reaction)) map.set(reaction, emoji)
    }
    return map
  })

  const getEmojiByReaction = (reaction: Reaction) => reactionMap.value.get(reaction)

  return { allEmojis, emojiMap, getEmojiById, getEmojiByReaction, getEmojisByShortcode, packs, roomEmojis }
}
