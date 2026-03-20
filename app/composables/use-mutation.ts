import type { MultiWatchSources, UseAsyncStateOptions } from '@vueuse/core'

interface Options<T extends (...args: any[]) => any> extends UseAsyncStateOptions<boolean, Awaited<ReturnType<T>> | undefined> {
  /**
   * Debounce the function call.
   *
   * @default false
   */
  debounce?: number | boolean
  /**
   * Callback before the function call. Does not adhere to debounce.
   */
  onMutate?: (prev: Awaited<ReturnType<T>> | undefined) => void
  /**
   * Execute mutation by reacting to changes in declared references. Adheres to debounce.
   *
   * @example
   * ```ts
   * const username = shallowRef('Alice')
   *
   * useMutation(() => ..., {
   *   watch: [username]
   * })
   * ```
   */
  watch?: MultiWatchSources
}

export function useMutation<T extends (...args: any[]) => any>(_fn: T, options?: Options<T>) {
  const fn = options?.debounce
    ? useDebounceFn(
        async () => _fn(),
        typeof options.debounce === 'number' ? options.debounce : 300,
      )
    : _fn

  let prev: Awaited<ReturnType<T>> | undefined
  const proc = useAsyncState<ReturnType<T> | undefined, any, boolean>(async () => {
    options?.onMutate?.(prev)
    prev = await fn()
    return prev as Awaited<ReturnType<T>>
  }, undefined, { ...options, immediate: false })

  if (options?.watch) {
    watch(options.watch, () => {
      proc.execute()
    })
  }

  return {
    ...proc,
    error: proc.error as Ref<Error | undefined>,
  }
}
