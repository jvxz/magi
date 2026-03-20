export const noSpaces = createRule({
  message: 'No spaces allowed',
  validator: (value) => {
    if (typeof value === 'string' && value.includes(' '))
      return false
    return true
  },

})
