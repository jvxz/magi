import type { ImageInfo as MatrixImageInfo, ImageContent as MatrixImageContent } from 'matrix-js-sdk/lib/types'

declare module 'matrix-js-sdk' {
  interface AccountDataEvents {
    'm.direct': Record<string, string[]>
  }

  interface ImageInfo extends MatrixImageInfo {
    'xyz.amorgan.blurhash'?: string
  }

  interface ImageContent extends MatrixImageContent {
    info?: ImageInfo
  }
}

declare module 'matrix-js-sdk/lib/@types/event' {
  type AccountDataEvents = AccountDataEvent
}

declare module 'matrix-js-sdk/lib/@types/event' {
  interface AccountDataEvents {
    'im.ponies.user_emotes': ImagePackContent
    'im.ponies.emote_rooms': { rooms: Record<string, Record<string, object>> }
  }
  interface StateEvents {
    'im.ponies.room_emotes': ImagePackContent
  }
}

export {}
