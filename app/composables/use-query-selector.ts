import type { MaybeRefOrGetter } from 'vue'
import { useMutationObserver } from '@vueuse/core'
import { shallowRef, toRef, toValue, watch } from 'vue'

type MaybeElement = HTMLElement | null | undefined

interface Opts {
  scope?: MaybeRefOrGetter<MaybeElement>
  observeScope?: boolean
}

/**
 * Reactive query selector
 */
export function useQuerySelector<T extends HTMLElement>(selector: MaybeRefOrGetter<string>, options?: Opts) {
  const scope = toRef(options?.scope)
  const selectorRef = toRef(selector)

  const get = () => {
    try {
      const selector = selectorRef.value
      if (!selector)
        return undefined

      const root = toValue(scope) ?? document.body

      return root.querySelector<T>(selector) ?? undefined
    }
    catch {
      return undefined
    }
  }

  const element = shallowRef<T | undefined>(get())

  const refresh = () => {
    const next = get()
    if (element.value !== next)
      element.value = next
  }

  watch([selectorRef, scope], refresh)

  if (options?.observeScope) {
    useMutationObserver(
      scope,
      () => {
        if (!element.value || !document.contains(element.value))
          refresh()
      },
      {
        childList: true,
        // subtree: true,
      },
    )
  }

  return {
    element,
    refresh,
  }
}
