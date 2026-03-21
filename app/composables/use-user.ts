export function useUser() {
  const clientStore = useClientStore()

  const getUserAvatar = (userId: MaybeRefOrGetter<'self' | string & {}>) => useAsyncData(`userAvatar:${userId}`, async () => {
    const id = userId === 'self' ? clientStore.client.getUserId()! : toValue(userId)
    const { avatar_url } = await clientStore.client.getProfileInfo(id)
    if (!avatar_url)
      return

    const url = mxcToHttps(avatar_url, {
      allowDirectLinks: false,
      allowRedirects: true,
      baseUrl: clientStore.client.getHomeserverUrl(),
      height: 32,
      resizeMethod: 'scale',
      useAuthentication: true,
      width: 32,
    })

    if (!url)
      return

    const res = await fetchAuthed(url, clientStore.client, { rawResponseBody: true })

    return URL.createObjectURL(res)
  })

  return {
    getUserAvatar,
  }
}
