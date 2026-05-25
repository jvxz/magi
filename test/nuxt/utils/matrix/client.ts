import { createClient } from 'matrix-js-sdk'
import { generateFakeHomeserver } from './credentials'

export const createMockClient = () =>
  createClient({
    baseUrl: generateFakeHomeserver(),
  })
