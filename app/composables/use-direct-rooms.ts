import { EventType } from 'matrix-js-sdk'

export const useDirectRooms = createSharedComposable(() => {
  const { client } = useMatrixClient()
  const status = useMatrixStatus()

  const directRooms = shallowRef(getDirectRooms(client.value))

  const refreshDirectRooms = () => (directRooms.value = getDirectRooms(client.value))

  async function addRoomToDirectList(roomId: string, userId: string) {
    const directsEvent = client.value.getAccountData(AccountDataEvent.Direct)
    let directs: Record<string, string[]> = {}

    if (isDefined(directsEvent)) directs = cloneDeep(directsEvent.getContent())

    const validDirects = mapValues(directs, (v, k) => (k === userId ? v : pull([...v], [roomId])))
    validDirects[userId] = uniq([...(validDirects[userId] ?? []), roomId])

    await client.value.setAccountData(AccountDataEvent.Direct, validDirects)
  }

  async function removeRoomFromDirectList(roomId: string) {
    const directsEvent = client.value.getAccountData(AccountDataEvent.Direct)
    let directs: Record<string, string[]> = {}

    if (isDefined(directsEvent)) directs = cloneDeep(directsEvent.getContent())

    const validDirects = mapValues(directs, v => pull([...v], [roomId]))

    await client.value.setAccountData(AccountDataEvent.Direct, validDirects)
  }

  const { onAccountData } = useMatrixHooks()
  onAccountData(e => {
    if (e.getType() !== EventType.Direct) return

    refreshDirectRooms()
  })

  watch(
    () => status.value.isDataSynced,
    () => (directRooms.value = getDirectRooms(client.value)),
  )

  return { addRoomToDirectList, directRooms, removeRoomFromDirectList }
})
