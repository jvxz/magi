import type { ImageInfo, MatrixClient, UploadOpts } from 'matrix-js-sdk'

import { encodeFromCanvas } from '@thi.ng/blurhash'
import { getHttpUriForMxc } from 'matrix-js-sdk'

import { MATRIX__BASE_URL } from '~/constants/matrix'

export function getMatrixIdType(id: string | undefined): 'user' | 'room' | 'unknown' {
  if (!id) return 'unknown'

  if (isUserId(id)) return 'user'
  if (isRoomId(id)) return 'room'
  return 'unknown'
}

export interface MatrixToUrl {
  type: 'userId' | 'roomId' | 'roomAlias' | 'event' | 'unknown'
  action?: 'join' | 'chat'
  via?: string[]
}

export function getMatrixToUrl(
  client: MatrixClient,
  type: MatrixToUrl['type'],
  id: string,
  opts?: {
    viaServers?: string[] | false
    eventId?: string
  },
) {
  const { eventId, viaServers } = opts ?? {}

  const url = parseURL(MATRIX__TO_URL)

  if (type === 'unknown') return url.toString()

  if (type === 'userId') {
    url.pathname = `/${id}`
  }

  if (type === 'roomAlias' || type === 'roomId' || type === 'event') {
    if (type === 'roomId') {
      if (Array.isArray(viaServers) && viaServers.length) {
        url.search = stringifyQuery({ via: viaServers })
      } else if (viaServers !== false) {
        const room = client.getRoom(id)

        if (room) {
          const via = getViaServers(room)
          if (via.length) {
            url.search = stringifyQuery({ via })
          }
        }
      }
    }

    url.pathname = `/${id}`

    if (type === 'event') {
      assert(eventId, 'attempted to create `matrix.to` URL for event, but `eventId` was `undefined`')
      url.pathname += `/${eventId}`
    }
  }

  url.pathname = `/#${url.pathname}`
  return stringifyParsedURL(url)
}

export function parseMatrixToUrl(url: string): MatrixToUrl {
  const unhashed = url.replace('/#/', '/')
  const parsed = parseURL(unhashed)
  const type =
    parsed.pathname.includes('/$') || parsed.hash.includes('/$')
      ? 'event'
      : parsed.pathname.includes('/!')
        ? 'roomId'
        : parsed.pathname.includes('/@')
          ? 'userId'
          : isRoomAlias(parsed.hash)
            ? 'roomAlias'
            : 'unknown'

  const query = parseQuery(parsed.search || parsed.hash.split('?')[1] || '')
  const via = toArray(query.via ?? [])
  const action = (Array.isArray(query.action) ? query.action[0] : query.action) as 'join' | 'chat' | undefined

  return {
    action,
    type,
    via,
  }
}

export function resolveViaArray(roomId: string, viaServers?: (string | undefined)[] | string) {
  const { serverName } = parseRoomId(roomId) ?? {}
  const via = toArray(viaServers ?? [])
  const res = compact(uniq([...via, ...(serverName ? [serverName] : [])]))
  return res.length ? res : undefined
}

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

export type UploadContentFile = File | Blob
export async function uploadContent(client: MatrixClient, file: UploadContentFile, opts?: UploadOpts) {
  return client.uploadContent(file, opts)
}

export async function toImageInfo(file: File): Promise<ImageInfo> {
  const bmp = await createImageBitmap(file)
  const blurhash = await createBlurhash(file)
  const info: ImageInfo = {
    h: bmp.height,
    mimetype: file.type,
    size: file.size,
    w: bmp.width,
    'xyz.amorgan.blurhash': blurhash,
  }
  bmp.close()
  return info
}

export async function createBlurhash(file: File) {
  const bmp = await createImageBitmap(file, { resizeQuality: 'low', resizeWidth: 32 })
  const cv = new OffscreenCanvas(bmp.width, bmp.height)

  cv.getContext('2d', { willReadFrequently: true })!.drawImage(bmp, 0, 0)
  bmp.close()

  return encodeFromCanvas(cv, 4, 3)
}
