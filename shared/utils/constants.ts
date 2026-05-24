import type { AvatarImageSize } from '../../app/utils/matrix/types'
import { EventType } from 'matrix-js-sdk'
import { M_POLL_START } from 'matrix-js-sdk/lib/@types/polls'

export const appMeta = {
  description: 'A familiar Matrix client for humans',
  name: 'Magi',
}

export const MATRIX_BASE_URL = 'https://matrix-client.matrix.org'

export const IMG_PLACEHOLDER_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const DEFAULT_RECENT_REACTIONS = ['😭', '❤️', '🔥', '🥺']
export const REACTABLE_EVENT_TYPES: (EventType | 'm.poll.start' | 'org.matrix.msc3381.poll.start' | (string & {}))[] = [
  EventType.RoomMessage,
  EventType.RoomMessageEncrypted,
  EventType.Sticker,
  M_POLL_START.name,
  M_POLL_START.altName,
]

export const AVATAR_IMAGE_SIZE_VALUES = {
  large: 512,
  medium: 256,
  small: 64,
} satisfies Record<AvatarImageSize, number>
