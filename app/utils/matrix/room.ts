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

  const directRooms: {
    userId: string
    roomId: string
  }[] = []
  for (const [userId, roomIds] of objectEntries(event.content)) {
    if (!roomIds.length || !roomIds[0])
      continue

    directRooms.push({
      roomId: roomIds[0],
      userId,
    })
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
      resizeMethod: 'scale',
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
    resizeMethod: 'scale',
    useAuthentication,
    width: size,
  })
}
