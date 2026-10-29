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

export {}
