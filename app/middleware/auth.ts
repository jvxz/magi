export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const status = useMatrixStatus()

  if (!status.value.isAuthed && to.path.includes('/app'))
    return navigateTo('/login')

  if (status.value.isAuthed && to.path.includes('/login'))
    return navigateTo('/app')
})
