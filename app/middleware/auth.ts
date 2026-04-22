export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  if (to.name === 'login') {
    const authInIdb = await idb.get('auth')
    if (authInIdb)
      return navigateTo('/app')
  }

  const status = useMatrixStatus()

  if (status.value.isStarting)
    return

  if (!status.value.isAuthed && to.meta.requiresAuth)
    return navigateTo('/login')

  if (status.value.isAuthed && to.name === 'login')
    return navigateTo('/app')
})
