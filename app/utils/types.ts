import type { UnwrapRef } from 'vue'

export type { RemovableRef } from '@vueuse/core'

export type DefineClasses<T extends keyof any> = Partial<Record<T, string>>

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type MaybeReadonlySet<T> = ReadonlySet<T> | Set<T>

export type AsideDisplayMode = keyof typeof ASIDE_DISPLAY_MODES

export type MaybeRefsOrGetters<T extends object> = Prettify<{
  [K in keyof T]: MaybeRefOrGetter<UnwrapRef<T[K]>>
}>

export type DeepMaybeRefsOrGetters<T extends object> = Prettify<{
  [K in keyof T]: UnwrapRef<T[K]> extends object
    ? MaybeRefsOrGetters<UnwrapRef<T[K]>>
    : MaybeRefOrGetter<UnwrapRef<T[K]>>
}>
