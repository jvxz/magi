import { getHttpUriForMxc } from 'matrix-js-sdk'

interface Opts {
  width?: number | undefined
  height?: number | undefined
  resizeMethod?: string | undefined
  allowDirectLinks?: boolean | undefined
  allowRedirects?: boolean | undefined
  useAuthentication?: boolean | undefined
  animated?: boolean | undefined
}

export function mxcToHttps(mxc: string | undefined, opts?: Opts) {
  try {
    return getHttpUriForMxc(
      MATRIX_BASE_URL,
      mxc,
      opts?.width,
      opts?.height,
      opts?.resizeMethod,
      opts?.allowDirectLinks,
      opts?.allowRedirects,
      opts?.useAuthentication,
      opts?.animated,
    )
  }
  catch {
    return undefined
  }
}
