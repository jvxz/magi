export function useResolveAvatarUrl(url: MaybeRefOrGetter<string | undefined>, opts?: MaybeRefOrGetter<ResolveAvatarUrlOpts>) {
  const urlRef = toRef(url)
  const optsRef = toRef(opts)
  const { client } = useMatrixClient()
  const reducedMotion = usePreferredReducedMotion()

  const resolvedUrl = computed(() => resolveAvatarUrl(urlRef.value, merge<ResolveAvatarUrlOpts, ResolveAvatarUrlOpts>({
    allowDirectLinks: true,
    allowRedirects: true,
    animated: reducedMotion.value !== 'reduce',
    baseUrl: client.value.getHomeserverUrl(),
    useAuthentication: true,
  }, optsRef.value ?? {})))

  return resolvedUrl
}
