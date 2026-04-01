import type { ClientEventHandlerMap, EmittedEvents, EventEmitterEvents, Listener } from 'matrix-js-sdk'

export type EmitterListener<T extends EventEmitterEvents | EmittedEvents> = Listener<EmittedEvents, ClientEventHandlerMap, T>

export interface RoomMemberTypingEventContent {
  user_ids: string[]
}
