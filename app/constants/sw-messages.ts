import * as v from 'valibot'

export const SwMessageSchema = v.union([
  makeMessage('session', v.object({
    accessToken: v.nullish(v.string()),
    baseUrl: v.nullish(v.string()),
  })),
  makeMessage('cache', v.object({
    action: v.union([v.literal('evict')]),
    cacheName: v.string(),
    urls: v.union([
      v.literal('all'),
      v.array(v.string()),
    ]),
  })),
])

export type SwMessage = v.InferOutput<typeof SwMessageSchema>
export type SwMessageType = SwMessage['type']
export type SwMessagePayload<T extends SwMessage['type']> = Extract<SwMessage, { type: T }>['payload']

function makeMessage<T extends string, P extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(type: T, payload: P) {
  return v.object({
    payload,
    type: v.literal(type),
  })
}
