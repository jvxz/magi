import { isEqual } from 'es-toolkit'

export function useUnsavedChanges<T extends object>(
  source: Ref<T>,
  onCommit: (draft: T) => unknown | Promise<unknown>,
) {
  const { cloned: unsavedChanges, sync } = useCloned(source, { manual: true })
  const baseline = shallowRef(source.value)

  const keys = computed(() => objectKeys<T>(baseline.value))
  const changedKeys = computed(() => {
    const changed = new Set<keyof T>()
    for (const key of keys.value) {
      if (!isEqual(unsavedChanges.value[key], baseline.value[key])) changed.add(key)
    }
    return changed
  })

  const isDirty = computed(() => !!changedKeys.value.size)
  const sourceHasChanges = computed(() => keys.value.some(key => !isEqual(source.value[key], baseline.value[key])))

  watch(source, current => {
    const next = { ...baseline.value }

    for (const key of objectKeys<T>(current)) {
      const conflicts = changedKeys.value.has(key) && !isEqual(unsavedChanges.value[key], current[key])
      if (conflicts) continue

      next[key] = current[key]
      unsavedChanges.value[key] = cloneDeep(current[key])
    }

    baseline.value = next
  })

  const resetChanges = () => {
    baseline.value = source.value
    sync()
  }

  const commitChanges = async () => onCommit(unsavedChanges.value)

  return { commitChanges, isDirty, resetChanges, sourceHasChanges, unsavedChanges }
}
