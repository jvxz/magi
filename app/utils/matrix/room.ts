import type { MatrixClient, MatrixEvent } from 'matrix-js-sdk'
import type { IHierarchyRoom } from 'matrix-js-sdk/lib/@types/spaces'

import { EventTimeline, EventType, KnownMembership, Room } from 'matrix-js-sdk'

import { $Error } from '#shared/utils/$error'
import { objectEntries } from '#shared/utils/object'

import type { MaybeRoomOrId, MaybeUserOrId } from './types'

import { mxcToHttps } from './mxc-to-https'
import { resolveUserId } from './user'

interface MDirect extends MatrixEvent {
  event: {
    type: 'm.direct'
    content: Record<string, string[]>
  }
}

interface GetAvatarUrlOpts {
  client: MatrixClient
  room: Room
  useAuthentication?: boolean
  size?: 32 | 96
}
export interface RoomsWithBatchToken {
  nextBatchToken?: string
  rooms: IHierarchyRoom[]
}

export function getRoom(client: MatrixClient, roomId: Room['roomId'], allowedIds?: MaybeReadonlySet<Room['roomId']>) {
  if (!allowedIds) return client.getRoom(roomId)

  if (allowedIds.has(roomId)) return client.getRoom(roomId)

  return undefined
}

export function getDirectRooms(client: MatrixClient) {
  const data = client.getAccountData(EventType.Direct) as MDirect | undefined
  if (!data) return []

  const { event } = data

  const directRooms: Room[] = []
  for (const [, roomIds] of objectEntries(event.content)) {
    const roomId = roomIds[0]
    if (!roomIds.length || !roomId) continue

    const room = client.getRoom(roomId)
    if (!room) continue

    directRooms.push(room)
  }

  return directRooms
}

export function getStateEvents(room: Room, eventType: EventType): MatrixEvent[] {
  return room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(eventType) ?? []
}

export function getRoomAvatarUrl({
  client,
  room,
  size = 32,
  useAuthentication = false,
}: GetAvatarUrlOpts): string | undefined {
  const mxcUrl = room.getMxcAvatarUrl()
  return mxcUrl
    ? (mxcToHttps(mxcUrl, {
        allowDirectLinks: false,
        allowRedirects: true,
        baseUrl: client.getHomeserverUrl(),
        height: size,
        resizeMethod: 'crop',
        useAuthentication,
        width: size,
      }) ?? undefined)
    : undefined
}

export function getDirectRoomAvatarUrl({
  client,
  room,
  size = 32,
  useAuthentication = false,
}: GetAvatarUrlOpts): string | undefined {
  const mxcUrl = room.getAvatarFallbackMember()?.getMxcAvatarUrl()

  if (!mxcUrl) return getRoomAvatarUrl({ client, room, size, useAuthentication })

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

export async function getSpaceRooms(
  client: MatrixClient,
  space: Room,
  nextBatchToken?: string,
): Promise<RoomsWithBatchToken> {
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
  if (!events) return []

  const joined: Room[] = []
  for (const event of events) {
    const roomData = client.getRoom(event.getStateKey())
    if (!roomData || roomData.getMyMembership() !== KnownMembership.Join) continue

    joined.push(roomData)
  }

  return joined
}

export function getMember(client: MatrixClient, userId: string | undefined, roomId: string | undefined) {
  if (!roomId || !userId) return

  const room = client.getRoom(roomId)
  if (!room) return

  const member = room.getMember(userId)
  if (!member) return

  const displayName = getRoomMemberDisplayName(room, userId)
  if (!displayName) return

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

export function getRoomMemberDisplayName(room: Room, userId: string | undefined) {
  if (!userId) return undefined

  const member = room.getMember(userId)

  const name = member?.name

  return name === userId ? undefined : name
}

export async function getRoomEventById(room: Room, client: MatrixClient, eventId: string) {
  const cachedEvent = room.findEventById(eventId)
  if (cachedEvent) return cachedEvent

  const eventData = await client.fetchRoomEvent(room.roomId, eventId)
  const mapper = client.getEventMapper()

  const mapped = mapper(eventData)

  return mapped
}

export function getPowerLevelName(powerLevel: number | undefined, ownerIsAdmin = false): PowerLevelName {
  if (isNil(powerLevel)) return 'unknown'

  if (powerLevel < 50) return 'member'

  if (powerLevel < 100) return 'moderator'

  if (powerLevel !== Infinity) return 'admin'

  return ownerIsAdmin ? 'admin' : 'owner'
}

export async function getMutualRooms(client: MatrixClient, otherUser: MaybeUserOrId | undefined, throwOnError = false) {
  try {
    if (!otherUser) return

    const otherUserId = resolveUserId(otherUser)
    return client._unstable_getSharedRooms(otherUserId)
  } catch {
    if (throwOnError) throw new $Error('Failed to get mutual rooms')
  }
}

// https://github.com/cinnyapp/cinny/blob/098684973ebb28592158efa43e79741ab27afab9/src/app/utils/room.ts#L96-L100
export function isSpaceChild(event: MatrixEvent) {
  return event.getType() === EventType.SpaceChild && Array.isArray(event.getContent().via)
}

export function isDirectRoom(client: MatrixClient, room: Room) {
  const directRooms = getDirectRooms(client)
  return directRooms.includes(room)
}

export function getRoomTopic(room: Room | undefined) {
  if (!room) return

  const events = getStateEvents(room, EventType.RoomTopic)
  if (events[0]) return events[0].getContent<{ topic?: string }>().topic
}

export function getRoomCreationTs(room: Room | undefined) {
  if (!room) return

  const events = getStateEvents(room, EventType.RoomCreate)
  if (events[0]) return events[0].getTs()
}

export function getRoomMembersTyping(room: Room) {
  const typingMembers = new Set<string>()
  for (const member of room.getMembers()) {
    if (member.typing) typingMembers.add(member.userId)
  }
  return typingMembers
}

export function resolveRoomId(maybeRoomOrId: MaybeRoomOrId) {
  if (maybeRoomOrId instanceof Room) return maybeRoomOrId.roomId

  return maybeRoomOrId
}

export function resolveRoomName(room: Room) {
  return room.name ?? room.roomId
}

const ROOM_ID_RE = /^!(?<localpart>[^:]+):(?<server_name>.+)$/
export function parseRoomId(roomId: string) {
  const match = roomId.match(ROOM_ID_RE)
  if (!match) return undefined

  return {
    localpart: match.groups?.localpart,
    serverName: match.groups?.server_name,
  }
}

export function isRoomId(roomId: string) {
  return ROOM_ID_RE.test(roomId)
}

export const isSpace = (room: Room) => room.isSpaceRoom()
export const isDirect = (room: Room, a: RoomAxes) => !isSpace(room) && a.directRoomIds.has(room.roomId)
export const isGroup = (room: Room, a: RoomAxes) => !isSpace(room) && !a.directRoomIds.has(room.roomId)
export const isOrphan = (room: Room, a: RoomAxes) => !a.inSpaceRoomIds.has(room.roomId)
