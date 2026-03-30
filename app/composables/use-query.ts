// implementation of `useQuery` that supports multiple watch sources

import type { DefaultError, DefinedInitialQueryOptions, QueryClient, QueryKey, UndefinedInitialQueryOptions, UseQueryDefinedReturnType, UseQueryOptions, UseQueryReturnType } from '@tanstack/vue-query'
import type { MultiWatchSources } from 'vue'
import { useQuery as _useQuery } from '@tanstack/vue-query'

interface CustomOptions {
  watch?: MultiWatchSources
}

type CustomUseQueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = Prettify<UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey> & CustomOptions>

type CustomDefinedInitialQueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = Prettify<DefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey> & CustomOptions>

type CustomUndefinedInitialQueryOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = Prettify<UndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey> & CustomOptions>

export function useQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: CustomDefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient): UseQueryDefinedReturnType<TData, TError>
export function useQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: CustomUndefinedInitialQueryOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient): UseQueryReturnType<TData, TError>
export function useQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: MaybeRefOrGetter<CustomUseQueryOptions<TQueryFnData, TError, TData, TQueryKey>>, queryClient?: QueryClient): UseQueryReturnType<TData, TError> {
  const q = _useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient)

  const opts = toValue(options)
  if (opts.watch && 'queryKey' in opts) {
    const { stop } = watch(opts.watch, () => q.refetch())

    onScopeDispose(stop)
  }

  return q
}
