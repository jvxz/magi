export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const authInIdb = await idb.get('auth')
  if (authInIdb && to.name === 'login')
    return navigateTo('/app')

  const status = useMatrixStatus()

  if (status.value.isStarting)
    return

  if (!status.value.isAuthed && to.name !== 'login')
    return navigateTo('/login')

  if (status.value.isAuthed && to.name === 'login')
    return navigateTo('/app')
})
