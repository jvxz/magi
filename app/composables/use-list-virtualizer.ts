import type { VirtualizerOptions } from '@tanstack/vue-virtual'
import type { PartialKeys } from '@tanstack/vue-virtual'

import { useVirtualizer } from '@tanstack/vue-virtual'

type ListVirtualizerOptions = PartialKeys<
  VirtualizerOptions<HTMLElement, Element>,
  'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>

export const useListVirtualizer = <T>(
  list: MaybeRefOrGetter<T[]>,
  scrollElement: MaybeRefOrGetter<HTMLElement | null>,
  {
    estimateSize,
    getItemKey,
    scrollMargin,
    ...opts
  }: Omit<ListVirtualizerOptions, 'count' | 'getScrollElement' | 'estimateSize' | 'getItemKey' | 'scrollMargin'> & {
    estimateSize: (item: T, index: number) => number
    getItemKey: (item: T) => number | string
    scrollMargin?: MaybeRefOrGetter<number>
  },
) =>
  useVirtualizer(
    computed<ListVirtualizerOptions>(() => {
      const listValue = toValue(list)
      const scrollElementValue = toValue(scrollElement)

      return {
        count: listValue.length,
        estimateSize: i => estimateSize(listValue[i]!, i),
        getItemKey: i => getItemKey(listValue[i]!),
        getScrollElement: () => scrollElementValue,
        overscan: 5,
        scrollMargin: toValue(scrollMargin),
        ...opts,
      }
    }),
  )
