import type { ClientEventHandlerMap, EmittedEvents, EventEmitterEvents, Listener, User } from 'matrix-js-sdk'

export type EmitterListener<T extends EventEmitterEvents | EmittedEvents> = Listener<EmittedEvents, ClientEventHandlerMap, T>

export interface RoomMemberTypingEventContent {
  user_ids: string[]
}

export type MaybeUserOrId = User | User['userId']

export type AvatarImageSize = 'small' | 'medium' | 'large'
