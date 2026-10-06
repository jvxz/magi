import { ICON__DIRECT_ROOM, ICON__ENCRYPTED } from './icon.ts'

export type AppLayoutSlotName = (typeof GENERAL__APP_LAYOUT_SLOT_NAMES)[number]

export const GENERAL__APP_LAYOUT_SLOT_NAMES = ['aside-header', 'aside', 'page-header'] as const

export const GENERAL__APP_META = {
  description: 'A familiar Matrix client for humans',
  name: 'Magi',
}

export const GENERAL__ASIDE_DISPLAY_MODES = {
  all: 'All rooms',
  direct: 'Direct rooms',
  loose: 'Loose rooms',
  orphan: 'Orphan rooms',
}

export const GENERAL__DEFAULT_RECENT_REACTIONS = ['😭', '❤️', '🔥', '🥺']

export const GENERAL__IMG_PLACEHOLDER_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const GENERAL__PUBLIC_ROOM_PAGINATION_LIMIT = 36

export const GENERAL__SORT_SELECT_DIRS = ['asc', 'desc'] as const

export const GENERAL__SORT_SELECT_OPTIONS = [
  'name',
  'date-modified',
  'date-created',
  'last-active',
  'verified',
] as const

export const GENERAL__TOAST_EXIT_MS = 150

export const GENERAL__TOOLTIP_ICON_META = {
  direct: {
    icon: ICON__DIRECT_ROOM,
    text: 'Direct room',
  },
  encrypted: {
    icon: ICON__ENCRYPTED,
    text: 'Encrypted',
  },
} as const

export const GENERAL__TYPING_TIMEOUT_MS = 4000
