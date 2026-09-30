import type { Room } from 'matrix-js-sdk'

import { KnownMembership, MatrixError } from 'matrix-js-sdk'


export const isUserId = (input: unknown): input is string => isString(input) && REGEX__USER_ID.test(input)

export const isRoomId = (input: unknown): input is string => isString(input) && REGEX__ROOM_ID.test(input)

export const isRoomAlias = (input: string): boolean => REGEX__MATRIX_ROOM_ALIAS.test(input)

export const isJoined = (room: Room) => room.getMyMembership() === KnownMembership.Join

export const isMatrixError = (value: unknown): value is MatrixError => value instanceof MatrixError
