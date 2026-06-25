import { toRef } from '@vueuse/core'

export const defineAppLabel = (label: MaybeRefOrGetter<string | undefined>, isLoading?: MaybeRefOrGetter<boolean>) => {
  const { subs } = useAppHeaderLabel()

  const sub = { isLoading: toRef(isLoading), label: toRef(label) }
  subs.push(sub)

  onScopeDispose(() => pull(subs, [sub]))
}
