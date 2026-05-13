import type { ClientEventHandlerMap, EmittedEvents, EventEmitterEvents, Listener, Room, User } from 'matrix-js-sdk'
import type { MatrixClient } from 'matrix-js-sdk/lib/client'

export type EmitterListener<T extends EventEmitterEvents | EmittedEvents> = Listener<
  EmittedEvents,
  ClientEventHandlerMap,
  T
>

export interface RoomMemberTypingEventContent {
  user_ids: string[]
}

export type MaybeUserOrId = User | User['userId']
export type MaybeRoomOrId = Room | Room['roomId']

export type AvatarImageSize = 'small' | 'medium' | 'large'

export type PowerLevelName = 'member' | 'moderator' | 'admin' | 'owner' | 'unknown'

export type IRoomHierarchy = Awaited<ReturnType<MatrixClient['getRoomHierarchy']>>
