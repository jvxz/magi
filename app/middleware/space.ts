export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server)
    return

  if (!('spaceId' in to.params)) {
    return navigateTo({
      name: 'me',
    })
  }
  const lastRouteKey = getLastSpaceRouteKey(to.params.spaceId)
  const lastRoute = localStorage.getItem(lastRouteKey)

  if (to.name === 'space' && lastRoute)
    return navigateTo(lastRoute)

  if (to.name !== 'space-browse' && !('roomId' in to.params)) {
    return navigateTo({
      name: 'space-browse',
      params: {
        spaceId: to.params.spaceId,
      },
    })
  }

  localStorage.setItem(lastRouteKey, to.path)
})
