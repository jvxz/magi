export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.requiresAuth)
    return navigateTo('/app')

  else return navigateTo('/')
})
