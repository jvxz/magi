import type { MatrixClient, MatrixEvent, Room } from 'matrix-js-sdk'
import type { IHierarchyRoom } from 'matrix-js-sdk/lib/@types/spaces'
import { EventTimeline, EventType, KnownMembership } from 'matrix-js-sdk'

interface MDirect extends MatrixEvent {
  event: {
    type: 'm.direct'
    content: Record<string, string[]>
  }
}

export function getDirectRooms(client: MatrixClient) {
  const data = client.getAccountData('m.direct') as MDirect | undefined
  if (!data)
    return []

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

export interface RoomsWithBatchToken {
  nextBatchToken?: string
  rooms: IHierarchyRoom[]
}

export async function getSpaceRooms(client: MatrixClient, space: Room, nextBatchToken?: string): Promise<RoomsWithBatchToken> {
  if (!space.isSpaceRoom()) {
    return {
      nextBatchToken: undefined,
      rooms: [],
    }
  }

  const spaceState = space.getLiveTimeline().getState(EventTimeline.FORWARDS)
  if (!spaceState) {
    console.warn('No room state found when getting space children')
    return {
      nextBatchToken: undefined,
      rooms: [],
    }
  }

  if (!nextBatchToken) {
    const res = await client.getRoomHierarchy(space.roomId, 50)

    return {
      nextBatchToken: res.next_batch,
      rooms: res.rooms,
    }
  }

  const res = await client.getRoomHierarchy(space.roomId, 50, undefined, false, nextBatchToken)

  return {
    nextBatchToken: res.next_batch,
    rooms: res.rooms,
  }
}

export function getJoinedRooms(client: MatrixClient, space: Room | undefined) {
  const events = space?.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EventType.SpaceChild)
  if (!events)
    return []

  const joined: Room[] = []
  for (const event of events) {
    const roomData = client.getRoom(event.getStateKey())
    if (!roomData || roomData.getMyMembership() !== KnownMembership.Join)
      continue

    joined.push(roomData)
  }

  return joined
}

export function getMember(client: MatrixClient, userId: string | undefined, roomId: string | undefined) {
  if (!roomId || !userId)
    return

  const room = client.getRoom(roomId)
  if (!room)
    return

  const member = room.getMember(userId)
  if (!member)
    return

  const displayName = getMemberDisplayName(room, userId)
  if (!displayName)
    return

  const avatarUrl = mxcToHttps(member.getMxcAvatarUrl() ?? undefined, {
    allowRedirects: true,
    baseUrl: client.getHomeserverUrl(),
    height: 400,
    resizeMethod: 'scale',
    useAuthentication: true,
    width: 400,
  })

  return {
    ...member,
    avatarUrl,
    displayName,
  }
}

export function getMemberDisplayName(room: Room, userId: string) {
  const member = room.getMember(userId)

  const name = member?.rawDisplayName

  return name === userId ? undefined : name
}

export async function getRoomEventById(room: Room, client: MatrixClient, eventId: string) {
  const cachedEvent = room.findEventById(eventId)
  if (cachedEvent)
    return cachedEvent

  const eventData = await client.fetchRoomEvent(room.roomId, eventId)
  const mapper = client.getEventMapper()

  const mapped = mapper(eventData)

  return mapped
}
