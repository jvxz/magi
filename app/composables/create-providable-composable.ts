import type { InjectionKey } from 'vue'

type Composable<Args extends any[], R> = (...args: Args) => R

interface ProvidableComposable<Args extends any[], R> {
  (...args: Args): R
  provide: (...args: Args) => R
  inject: () => R
}

export function createProvidableComposable<Args extends any[], R>(
  name: string,
  composable: Composable<Args, R>,
): ProvidableComposable<Args, R> {
  const key: InjectionKey<R> = Symbol(name)

  const fn = ((...args: Args) => composable(...args)) as ProvidableComposable<Args, R>

  fn.provide = (...args: Args) => {
    const instance = composable(...args)
    provide(key, instance)
    return instance
  }

  fn.inject = () => {
    const instance = inject(key, null)
    if (instance === null)
      throw new Error(
        `(${name}) \`${name}.inject()\` was called without a matching \`${name}.provide()\` in an ancestor`,
      )
    return instance
  }

  return fn
}
