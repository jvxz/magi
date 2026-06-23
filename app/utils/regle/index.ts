import { required } from '@regle/rules'

export const regleUserIdDefs = {
  required: withMessage(required, 'User ID is required'),
  validId: withMessage(isUserId, 'Invalid user ID'),
}
