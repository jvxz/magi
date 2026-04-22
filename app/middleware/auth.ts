export default defineNuxtRouteMiddleware((to) => {
  const status = useMatrixStatus()

  if (import.meta.server || status.value.isStarting)
    return

  if (
    isTestMode()
    && (useCookie('test-flag:skip-auth-middleware').value || localStorage.getItem('magi:test:auth'))
  )
    status.value.isAuthed = true

  if (!status.value.isAuthed && to.path.includes('/app'))
    return navigateTo('/login')

  if (status.value.isAuthed && to.path.includes('/login'))
    return navigateTo('/app')
})
