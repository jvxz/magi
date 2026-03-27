import type { MatrixClient, MatrixEvent, Room } from 'matrix-js-sdk'

interface MDirect extends MatrixEvent {
  event: {
    type: 'm.direct'
    content: Record<string, string[]>
  }
}

export function getDirectRooms(client: MatrixClient) {
  const data = client.getAccountData('m.direct') as MDirect | undefined
  if (!data)
    throw new Error('Failed to get direct rooms. This function should only be called after the account data is synced.')

  const { event } = data

  const directRooms: Room[] = []
  for (const [, roomIds] of objectEntries(event.content)) {
    const roomId = roomIds[0]
    if (!roomIds.length || !roomId)
      continue

    const room = client.getRoom(roomId)
    if (!room)
      continue

    directRooms.push(room)
  }

  return directRooms
}

interface GetAvatarUrlOpts {
  client: MatrixClient
  room: Room
  useAuthentication?: boolean
  size?: 32 | 96
}

export function getRoomAvatarUrl({ client, room, size = 32, useAuthentication = false }: GetAvatarUrlOpts): string | undefined {
  const mxcUrl = room.getMxcAvatarUrl()
  return mxcUrl
    ? mxcToHttps(mxcUrl, {
      allowDirectLinks: false,
      allowRedirects: true,
      baseUrl: client.getHomeserverUrl(),
      height: size,
      resizeMethod: 'crop',
      useAuthentication,
      width: size,
    }) ?? undefined
    : undefined
}

export function getDirectRoomAvatarUrl({ client, room, size = 32, useAuthentication = false }: GetAvatarUrlOpts): string | undefined {
  const mxcUrl = room.getAvatarFallbackMember()?.getMxcAvatarUrl()

  if (!mxcUrl)
    return getRoomAvatarUrl({ client, room, size, useAuthentication })

  return mxcToHttps(mxcUrl, {
    allowDirectLinks: false,
    allowRedirects: true,
    baseUrl: client.getHomeserverUrl(),
    height: size,
    resizeMethod: 'crop',
    useAuthentication,
    width: size,
  })
}
