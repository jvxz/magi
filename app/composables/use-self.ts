export const useSelf = createGlobalState(() => {
  const { client } = useMatrixClient()

  const self = useUser(() => client.value.getSafeUserId())

  return { self }
})
