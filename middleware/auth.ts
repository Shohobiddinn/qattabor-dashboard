export default defineNuxtRouteMiddleware((to, from) => {
    const cookies = useCookie('access_token')
    if (cookies.value && to.name === 'sign-in') {
      return navigateTo('/')
    }
    if (!cookies.value && to.name !== 'sign-in') {
      return navigateTo('/sign-in')
    }
  })
  