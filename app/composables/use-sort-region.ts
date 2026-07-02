import { toRef } from '@vueuse/core'

import type { SortSelectModelValue } from '~/components/u/sort-select/root.vue'

export const useSortRegion = (
  region: MaybeRefOrGetter<string>,
  defaultValue: SortSelectModelValue = {
    dir: 'asc',
    option: 'name',
  },
) => {
  const regionRef = toRef(region)
  const sortState = useScopedLocalStorage<SortSelectModelValue>(() => `sortRegion:${regionRef.value}`, defaultValue)

  return {
    sortState,
  }
}
