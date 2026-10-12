import type { StringOrNumber } from 'reka-ui'

type SerializableKeys<T extends object> = {
  [K in keyof T]: T[K] extends StringOrNumber ? K : never
}[keyof T]

const resolve = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export function useFilter<T extends object>(
  input: MaybeRefOrGetter<T[]>,
  opts: {
    query: MaybeRefOrGetter<string>
    keys: MaybeRefOrGetter<SerializableKeys<T>[]>
  },
) {
  const map = computed(() => {
    const keys = toValue(opts.keys)
    return toValue(input).map(item => resolve(keys.map(k => item[k]).join('\n')))
  })

  return computed(() => {
    const items = toValue(input)
    const query = resolve(toValue(opts.query))
    if (!query) return items

    const keys = map.value
    return items.filter((_, i) => keys[i]!.includes(query))
  })
}
