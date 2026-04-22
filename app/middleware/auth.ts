export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const authInIdb = await idb.get('auth')
  if (authInIdb && to.name === 'login')
    return navigateTo('/app')

  const status = useMatrixStatus()

  if (status.value.isStarting)
    return

  if (isAuthMocked())
    status.value.isAuthed = true

  if (!status.value.isAuthed && to.path.includes('/app'))
    return navigateTo('/login')

  if (status.value.isAuthed && to.path.includes('/login'))
    return navigateTo('/app')
})
