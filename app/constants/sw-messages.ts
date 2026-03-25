import * as z from 'zod'

export const SwMessageSchema = z.union([
  makeMessage('session', z.object({
    accessToken: z.string().nullish(),
    baseUrl: z.string().nullish(),
  })),
])

export type SwMessage = z.infer<typeof SwMessageSchema>
export type SwMessageType = SwMessage['type']
export type SwMessagePayload<T extends SwMessage['type']> = Extract<SwMessage, { type: T }>['payload']

function makeMessage<T extends string, P extends z.ZodType>(type: T, payload: P) {
  return z.object({
    payload,
    type: z.literal(type),
  })
}
