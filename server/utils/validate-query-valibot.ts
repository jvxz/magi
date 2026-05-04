import type { H3Event } from 'h3'
import type { BaseIssue, BaseSchema, InferOutput } from 'valibot'
import { createError, getQuery } from 'h3'

export async function validateQueryValibot<
  T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(event: H3Event, schema: T): Promise<InferOutput<T>> {
  const query = getQuery(event)
  const result = v.safeParse(schema, query)

  if (!result.success) {
    throw createError({
      data: result.issues,
      message: 'Invalid query parameters',
      statusCode: 422,
    })
  }

  return result.output
}
