import type { StateEvents } from 'matrix-js-sdk'

import { AuthType, EventType, JoinRule } from 'matrix-js-sdk'

import type { AvatarImageSize } from '../utils/matrix/types'

// https://github.com/cinnyapp/cinny/blob/5e00d517ebd6b77663e41bcbe888b37df6d3b3d9/src/app/hooks/useAccountManagement.ts#L6-L11
export const MATRIX__ACCOUNT_MANAGEMENT_ACTIONS = {
  ACCOUNT_DEACTIVATE: 'org.matrix.account_deactivate',
  CROSS_SIGNING_RESET: 'org.matrix.cross_signing_reset',
  PROFILE: 'org.matrix.profile',
  SESSIONS_LIST: 'org.matrix.sessions_list',
  SESSION_END: 'org.matrix.session_end',
  SESSION_VIEW: 'org.matrix.session_view',
} as const

export const MATRIX__ALLOWED_ATTRS = [
  'href',
  'target',
  'rel',
  'src',
  'width',
  'height',
  'alt',
  'title',
  'class',
  'start',
  'data-mx-color',
  'data-mx-bg-color',
  'data-mx-spoiler',
  'data-mx-maths',
] as const

export const MATRIX__ALLOWED_ATTRS_PER_TAG = {
  a: ['target', 'href'],
  code: ['class'],
  div: ['data-mx-maths'],
  img: ['width', 'height', 'alt', 'title', 'src'],
  ol: ['start'],
  span: ['data-mx-bg-color', 'data-mx-color', 'data-mx-spoiler', 'data-mx-maths'],
} as const

export const MATRIX__ALLOWED_AVATAR_FILE_TYPES = {
  accept: {
    'image/apng': ['.apng'],
    'image/avif': ['.avif'],
    'image/gif': ['.gif'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  description: 'Image files',
}

export const MATRIX__ALLOWED_TAGS = [
  'a',
  'code',
  'img',
  'span',
  'ol',
  'div',
  'pre',
  'p',
  'blockquote',
  'ul',
  'li',
  'br',
  'hr',
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'del',
  'sub',
  'sup',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'caption',
  'details',
  'summary',
] as const

export const MATRIX__AVATAR_IMAGE_SIZE_VALUES = {
  full: -1,
  large: 512,
  medium: 256,
  small: 64,
} satisfies Record<AvatarImageSize, number>

export const MATRIX__BASE_URL = 'https://matrix-client.matrix.org'

export const MATRIX__CONFIGURABLE_ROOM_SETTINGS = [
  EventType.RoomAvatar,
  EventType.RoomName,
  EventType.RoomTopic,
  EventType.RoomJoinRules,
  EventType.RoomPowerLevels,
] as const satisfies (keyof StateEvents)[]

// https://spec.matrix.org/v1.19/client-server-api/#mroompower_levels
export const MATRIX__DEFAULT_POWER_LEVELS = {
  ban: 50,
  events_default: 0,
  invite: 0,
  kick: 50,
  notifications: { room: 50 },
  redact: 50,
  state_default: 50,
  users_default: 0,
} as const

export const MATRIX__JOIN_RULE_NAME_MAP: Record<JoinRule, string> = {
  invite: 'Invite only',
  knock: 'Knock or invite',
  private: 'Private',
  public: 'Public',
  restricted: 'Restricted',
}

export const MATRIX__JOIN_RULE_SETTABLE_RULES: JoinRule[] = [JoinRule.Public, JoinRule.Invite, JoinRule.Knock]

// missing entries are filled with state_default
export const MATRIX__POWER_LEVEL_EDITABLE_EVENTS = [
  EventType.SpaceChild,
  EventType.RoomAvatar,
  EventType.RoomName,
  EventType.RoomTopic,
  EventType.RoomJoinRules,
  EventType.RoomCanonicalAlias,
  EventType.RoomPowerLevels,
  EventType.RoomTombstone,
] as const

export const MATRIX__POWERLEVEL_MAX = 9007199254740991
export const MATRIX__POWERLEVEL_MIN = -MATRIX__POWERLEVEL_MAX

export const MATRIX__REACTABLE_EVENT_TYPES: (
  | EventType
  | 'm.poll.start'
  | 'org.matrix.msc3381.poll.start'
  | (string & {})
)[] = [
  EventType.RoomMessage,
  EventType.RoomMessageEncrypted,
  EventType.Sticker,
  'm.poll.start',
  'org.matrix.msc3381.poll.start',
]

// https://github.com/cinnyapp/cinny/blob/80fd8863c9a07e89d6a2037e3e196cd8f372a2b1/src/app/components/create-room/utils.ts#L81-L87
export const MATRIX__ROOM_INITIAL_STATE_ENCRYPTION = {
  content: {
    algorithm: 'm.megolm.v1.aes-sha2',
  },
  state_key: '',
  type: 'm.room.encryption',
} as const

export const MATRIX__TO_URL = 'https://matrix.to'

export const MATRIX__UIA_SUPPORTED_STAGES = new Set<AuthType | (string & {})>([
  AuthType.Password,
  AuthType.Recaptcha,
  AuthType.Sso,
  AuthType.Email,
])
