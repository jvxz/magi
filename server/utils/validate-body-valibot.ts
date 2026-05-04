import type { H3Event } from 'h3'
import type { BaseIssue, BaseSchema, InferOutput } from 'valibot'
import { createError, readBody } from 'h3'

export async function validateBodyValibot<
  T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(event: H3Event, schema: T): Promise<InferOutput<T>> {
  const body = await readBody(event)
  const result = v.safeParse(schema, body)

  if (!result.success) {
    throw createError({
      data: result.issues,
      message: 'Invalid body',
      statusCode: 422,
    })
  }

  return result.output
}
