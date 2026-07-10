import { useIsMutating } from '@tanstack/vue-query'

type MutationFactory<K extends $MKKey> = (typeof $mk)[K]
type MutationParams<K extends $MKKey> = MutationFactory<K> extends (...args: infer P) => unknown ? P : never

export const useIsKeyMutating = <T extends $MKKey>(mkKey: T, ...params: MutationParams<T>) => {
  const factory = $mk[mkKey] as (...params: MutationParams<T>) => ReturnType<MutationFactory<T>>
  const num = useIsMutating(computed(() => ({ mutationKey: factory(...params) })))
  return computed(() => !!num.value)
}
