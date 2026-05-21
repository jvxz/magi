import { toRef } from '@vueuse/core'

export const [provideIntersectionObserver, injectIntersectionObserver] = createInjectionState(
  (scrollEl: MaybeRefOrGetter<HTMLElement | null>) => {
    const scrollElRef = toRef(scrollEl)
    const callbacks = new Map<Element, (entry: IntersectionObserverEntry) => void>()
    const pending = new Map<Element, (entry: IntersectionObserverEntry) => void>()
    let observer: IntersectionObserver | undefined

    watchEffect(onCleanup => {
      if (!scrollElRef.value) return

      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) callbacks.get(entry.target)?.(entry)
        },
        { root: scrollElRef.value, rootMargin: '200px' },
      )

      for (const [el, cb] of pending) {
        callbacks.set(el, cb)
        observer.observe(el)
      }
      pending.clear()

      onCleanup(() => observer?.disconnect())
    })

    return {
      observe(el: Element, cb: (entry: IntersectionObserverEntry) => void) {
        if (observer) {
          callbacks.set(el, cb)
          observer.observe(el)
        } else pending.set(el, cb)
      },
      unobserve(el: Element) {
        callbacks.delete(el)
        pending.delete(el)
        observer?.unobserve(el)
      },
    }
  },
)
