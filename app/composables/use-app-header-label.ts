import { toRef } from '@vueuse/core'

interface Subscriber {
  label: Ref<string | undefined>
  isLoading?: Ref<boolean | undefined>
}

export const useAppHeaderLabel = createGlobalState(() => {
  const subs = shallowReactive<Subscriber[]>([])

  const label = computed(() => last(subs)?.label.value ?? 'Magi')
  const isLoading = computed(() => last(subs)?.isLoading?.value ?? false)

  return {
    isLoading,
    label,
    subs,
  }
})

export const defineAppLabel = ({ label, isLoading }: MaybeRefsOrGetters<Subscriber>) => {
  const { subs } = useAppHeaderLabel()
  const sub = { isLoading: toRef(isLoading), label: toRef(label) }

  subs.push(sub)

  onScopeDispose(() => pull(subs, [sub]))
}
