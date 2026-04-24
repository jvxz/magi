import type { AvatarImageSize } from '~/utils/matrix/types'

export const appMeta = {
  description: 'A familiar Matrix client for humans',
  name: 'Magi',
}

export const MATRIX_BASE_URL = 'https://matrix-client.matrix.org'

export const IMG_PLACEHOLDER_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const AVATAR_IMAGE_SIZE_VALUES = {
  large: 512,
  medium: 256,
  small: 64,
} satisfies Record<AvatarImageSize, number>
