export const useRooms = createUnrefFn((type: 'direct' | 'all' | 'non-direct' = 'non-direct') => {
  const { client } = useMatrixClient()
  if (type === 'all')
    return client.value.getRooms()

  const allRooms = client.value.getRooms()
  const directRooms = getDirectRooms(client.value)

  return allRooms.filter((room) => {
    return (type === 'direct' ? directRooms.includes(room) : !directRooms.includes(room)) && room.isSpaceRoom()
  })
})
