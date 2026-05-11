import type { MatrixClient } from 'matrix-js-sdk/lib/client'

export type IRoomHierarchy = Awaited<ReturnType<MatrixClient['getRoomHierarchy']>>
