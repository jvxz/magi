export function useResolveImageUrl(
  url: MaybeRefOrGetter<string | undefined>,
  opts?: MaybeRefOrGetter<ResolveImageUrlOpts>,
) {
  const urlRef = toRef(url)
  const optsRef = toRef(opts)
  const { client } = useMatrixClient()
  const reducedMotion = usePreferredReducedMotion()

  const resolvedUrl = computed(() => {
    const { protocol } = parseURL(urlRef.value)
    if (protocol !== 'mxc:') return urlRef.value

    return resolveImageUrl(
      urlRef.value,
      merge<ResolveImageUrlOpts, ResolveImageUrlOpts>(
        {
          allowDirectLinks: true,
          allowRedirects: true,
          animated: reducedMotion.value !== 'reduce',
          baseUrl: client.value.getHomeserverUrl(),
          useAuthentication: true,
        },
        optsRef.value ?? {},
      ),
    )
  })

  return resolvedUrl
}
