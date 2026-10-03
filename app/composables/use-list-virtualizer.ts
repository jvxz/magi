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
    ...opts
  }: Omit<ListVirtualizerOptions, 'count' | 'getScrollElement' | 'estimateSize' | 'getItemKey'> & {
    estimateSize: (item: T) => number
    getItemKey: (item: T) => number | string
  },
) =>
  useVirtualizer(
    computed<ListVirtualizerOptions>(() => {
      const listValue = toValue(list)
      const scrollElementValue = toValue(scrollElement)

      return {
        count: listValue.length,
        estimateSize: i => estimateSize(listValue[i]!),
        getItemKey: i => getItemKey(listValue[i]!),
        getScrollElement: () => scrollElementValue,
        overscan: 5,
        ...opts,
      }
    }),
  )
