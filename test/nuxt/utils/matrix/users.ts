import type { MatrixClient } from 'matrix-js-sdk'

import { User } from 'matrix-js-sdk'

export const createMockUser = (userId: string, client: MatrixClient) => User.createUser(userId, client)
