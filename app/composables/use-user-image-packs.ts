export const useUserImagePacks = createGlobalState(() => {
  const userPacksRaw = useAccountData(AccountDataEvent.PoniesUserEmotes)
  const roomPacksRaw = useAccountData(AccountDataEvent.PoniesEmoteRooms)

  const userEmotes = computed(() => formatImagePack(userPacksRaw.value, 'user'))

  const { revisions } = useRoomRevisions()
  const roomPacks = computed(() => {
    if (!roomPacksRaw.value) return
    const roomPacks = new Map<string, ImagePack>()

    const { client } = useMatrixClient()
    const { rooms } = roomPacksRaw.value.getContent<UserRoomImagePackContent>()
    for (const [roomId, packs] of objectEntries(rooms)) {
      const room = getRoom(client.value, roomId)
      if (!room) continue

      void revisions.get(roomId)

      for (const packName of objectKeys(packs)) {
        const id = `${roomId}/${packName}`
        const formattedPack = formatImagePack(getRoomImagePack(room, packName), id)
        if (!formattedPack) continue

        roomPacks.set(id, formattedPack)
      }
    }

    return roomPacks
  })

  const allEmojiPacks = computed(() => {
    const allEmojiPacks: ImagePack[] = []
    const packs = [userEmotes.value, ...(roomPacks.value?.values() ?? [])]
    for (const pack of packs) {
      if (!pack) continue
      if (pack.usage?.length && !pack.usage.includes('emoticon')) continue

      allEmojiPacks.push(pack)
    }

    return allEmojiPacks
  })

  return { allEmojiPacks, roomPacks, userEmotes }
})
