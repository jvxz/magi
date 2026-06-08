import { EventType } from 'matrix-js-sdk'

import type { AvatarImageSize } from '../../app/utils/matrix/types'

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
  'm.poll.start',
  'org.matrix.msc3381.poll.start',
]

export const AVATAR_IMAGE_SIZE_VALUES = {
  large: 512,
  medium: 256,
  small: 64,
} satisfies Record<AvatarImageSize, number>

export const TYPING_TIMEOUT_MS = 4000

export const MATRIX = {
  MESSAGING: {
    ALLOWED_ATTRS: [
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
    ],
    ALLOWED_ATTRS_PER_TAG: {
      a: ['target', 'href'],
      code: ['class'],
      div: ['data-mx-maths'],
      img: ['width', 'height', 'alt', 'title', 'src'],
      ol: ['start'],
      span: ['data-mx-bg-color', 'data-mx-color', 'data-mx-spoiler', 'data-mx-maths'],
    },
    ALLOWED_TAGS: [
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
    ],
  },
} as const
