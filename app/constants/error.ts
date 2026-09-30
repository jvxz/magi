import type { ErrorShape } from '../utils/error'

import { ErrorCode } from '../utils/error'

export const ERROR__INVALID_HOMESERVER = {
  code: ErrorCode.InvalidHomeserver,
  message: 'The provided homeserver is invalid. Please ensure the URL provided is correct with no misspellings.',
  title: 'Invalid homeserver',
} satisfies ErrorShape

export const ERROR__UNKNOWN = {
  code: ErrorCode.Unknown,
  message: 'An unexpected error occurred. Please try again later',
  title: 'Unknown error',
} satisfies ErrorShape
