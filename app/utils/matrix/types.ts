import type {
  ClientEventHandlerMap,
  EventType,
  EmittedEvents,
  EventEmitterEvents,
  Listener,
  MatrixEvent,
  Room,
  StateEvents,
  User,
  Visibility,
} from 'matrix-js-sdk'
import type { MatrixClient } from 'matrix-js-sdk/lib/client'
import type { RoomPowerLevelsEventContent } from 'matrix-js-sdk/lib/types'

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
export enum PowerLevelByName {
  Member = 0,
  Moderator = 50,
  Admin = 100,
  Owner = 101,
}

export type IRoomHierarchy = Awaited<ReturnType<MatrixClient['getRoomHierarchy']>>
export type IMediaConfig = Awaited<ReturnType<MatrixClient['getMediaConfig']>>

export enum RoomAccountDataEvent {
  FullyRead = 'm.fully_read',
  Tag = 'm.tag',
  MarkedUnread = 'm.marked_unread',
}

// adapted from https://github.com/cinnyapp/cinny/blob/80fd8863c9a07e89d6a2037e3e196cd8f372a2b1/src/types/matrix/accountData.ts#L1-L19
export enum AccountDataEvent {
  Direct = 'm.direct',
  PushRules = 'm.push_rules',
  IdentityServer = 'm.identity_server',
  IgnoredUserList = 'm.ignored_user_list',
  InvitePermissionConfig = 'm.invite_permission_config',
  AcceptedTerms = 'm.accepted_terms',
  RecentEmoji = 'm.recent_emoji',
  KeyBackup = 'm.key_backup',
  SecretStorageDefaultKey = 'm.secret_storage.default_key',

  ElementRecentEmoji = 'io.element.recent_emoji',

  PoniesUserEmotes = 'im.ponies.user_emotes',
  PoniesEmoteRooms = 'im.ponies.emote_rooms',

  CrossSigningMaster = 'm.cross_signing.master',
  CrossSigningSelfSigning = 'm.cross_signing.self_signing',
  CrossSigningUserSigning = 'm.cross_signing.user_signing',
  MegolmBackupV1 = 'm.megolm_backup.v1',
}

export type StateRoomSettings = Pick<StateEvents, (typeof MATRIX__CONFIGURABLE_ROOM_SETTINGS)[number]>
export interface RoomSettings extends StateRoomSettings {
  directoryVisibility: Visibility
  [EventType.RoomPowerLevels]: RoomPowerLevelsEventContent & {
    events: Partial<Record<EventType, number>>
  }
}
