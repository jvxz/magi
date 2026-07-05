import { MatrixError, TokenRefreshError } from 'matrix-js-sdk'

export interface ErrorShape {
  code?: string
  message: string
  title?: string
  raw: string
}

export function parseError(error: unknown, opts?: { fallbackMessage?: string }): ErrorShape {
  const fallbackMessage = opts?.fallbackMessage ?? 'Unknown error'

  if (error instanceof $Error)
    return {
      message: error.message,
      raw: JSON.stringify(error),
      title: error.name,
    }

  if (error instanceof MatrixError)
    return {
      code: error.errcode,
      message: error.data.error ?? error.message,
      raw: JSON.stringify(error.data),
      title: error.data.errcode,
    }

  if (error instanceof TokenRefreshError)
    return {
      message: error.message,
      raw: JSON.stringify(error),
      title: error.name,
    }

  return {
    message: fallbackMessage,
    raw: JSON.stringify(error),
  }
}
