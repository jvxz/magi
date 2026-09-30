import { getHttpUriForMxc } from 'matrix-js-sdk'

import { MATRIX__BASE_URL } from '~/constants/matrix'

export interface MxcToHttpsOptions {
  baseUrl?: string | undefined
  width?: number | undefined
  height?: number | undefined
  resizeMethod?: string | undefined
  allowDirectLinks?: boolean | undefined
  allowRedirects?: boolean | undefined
  useAuthentication?: boolean | undefined
  animated?: boolean | undefined
}

export function mxcToHttps(mxc: string | undefined, opts?: MxcToHttpsOptions) {
  try {
    return getHttpUriForMxc(
      opts?.baseUrl ?? MATRIX__BASE_URL,
      mxc,
      opts?.width,
      opts?.height,
      opts?.resizeMethod,
      opts?.allowDirectLinks,
      opts?.allowRedirects,
      opts?.useAuthentication,
      opts?.animated,
    )
  } catch {
    return undefined
  }
}
