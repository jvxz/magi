defineNuxtRouteMiddleware((to) => {
  const status = useMatrixStatus()

  if (import.meta.server || status.value.isStarting)
    return

  if (!status.value.isAuthed && to.path.includes('/app'))
    return navigateTo('/login')

  if (status.value.isAuthed && to.path.includes('/login'))
    return navigateTo('/app')
})
