import type {
  ClientEventHandlerMap,
  EmittedEvents,
  EventEmitterEvents,
  Listener,
  MatrixEvent,
  Room,
  User,
} from 'matrix-js-sdk'
import type { MatrixClient } from 'matrix-js-sdk/lib/client'

export type EmitterListener<T extends EventEmitterEvents | EmittedEvents> = Listener<
  EmittedEvents,
  ClientEventHandlerMap,
  T
>

export type Reaction = string

export interface RoomMemberTypingEventContent {
  user_ids: string[]
}

export type MaybeUserOrId = User | User['userId']
export type MaybeRoomOrId = Room | Room['roomId']
export type MaybeEventOrId = MatrixEvent | string

export type AvatarImageSize = 'small' | 'medium' | 'large' | 'full'

export type PowerLevelName = 'member' | 'moderator' | 'admin' | 'owner' | 'unknown'

export type IRoomHierarchy = Awaited<ReturnType<MatrixClient['getRoomHierarchy']>>
