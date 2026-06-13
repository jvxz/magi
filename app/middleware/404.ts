export default defineNuxtRouteMiddleware(to => {
  if (to.meta.requiresAuth) return navigateTo({ name: 'me' })
  else return navigateTo('/')
})
