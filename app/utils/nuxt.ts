import type { LocationQueryValue, RouteLocationNormalized } from '#vue-router'

export function hasParams<T extends string>(
  route: RouteLocationNormalized,
  paramNames: T | readonly T[],
): route is RouteLocationNormalized & { params: Record<T, string> } {
  const names = Array.isArray(paramNames) ? paramNames : [paramNames]

  return names.length > 0 && names.every(name => name.length > 0 && Object.hasOwn(route.params, name))
}

export function hasQuery<T extends string>(
  route: RouteLocationNormalized,
  queryNames: T | readonly T[],
): route is RouteLocationNormalized & { query: Record<T, NonNullable<LocationQueryValue>> } {
  const names = Array.isArray(queryNames) ? queryNames : [queryNames]

  return names.length > 0 && names.every(name => name.length > 0 && Object.hasOwn(route.query, name))
}
