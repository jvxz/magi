import type { MatrixClient } from 'matrix-js-sdk'
import { Method } from 'matrix-js-sdk'

interface Options {
  method?: Method
  body?: Record<string, string>
  rawResponseBody?: boolean
  prefix?: string
}

export async function fetchAuthed(raw: string, client: MatrixClient, opts?: Options & { rawResponseBody: true }): Promise<Blob>
export async function fetchAuthed(raw: string, client: MatrixClient, opts?: Options & { rawResponseBody: false }): Promise<unknown>
export async function fetchAuthed(raw: string, client: MatrixClient, opts?: Options & { rawResponseBody?: undefined }): Promise<unknown>
export async function fetchAuthed(raw: string, client: MatrixClient, opts?: Options) {
  const url = new URL(raw)

  const queryParams: Record<string, string> = {}
  url.searchParams.forEach((v, k) => {
    queryParams[k] = v
  })

  const res = await client.http.authedRequest(
    opts?.method ?? Method.Get,
    url.pathname,
    queryParams,
    opts?.body ? JSON.stringify(opts.body) : undefined,
    { prefix: opts?.prefix ?? '', rawResponseBody: opts?.rawResponseBody ?? false },
  )

  if (opts?.rawResponseBody)
    return res as Blob

  return res as unknown
}
