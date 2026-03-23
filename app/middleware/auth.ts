export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const { client } = useMatrixClient()
  const unauthed = client.value.isGuest()

  if (unauthed && to.path.includes('/app'))
    return navigateTo('/login')

  if (!unauthed && to.path.includes('/login'))
    return navigateTo('/app')
})
