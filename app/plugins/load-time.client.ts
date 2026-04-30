export default defineNuxtPlugin({
  setup: (nuxt) => {
    const config = useRuntimeConfig()
    if (!config.public.showLoadTime)
      return

    const loadTime = ref(0)

    const appInit = Date.now()
    let navStart = appInit
    const router = useRouter()

    nuxt.hook('app:mounted', () => {
      const appLoad = Date.now()
      loadTime.value = Number((appLoad - appInit).toFixed(2))
    })

    router.beforeEach(() => {
      navStart = Date.now()
    })

    nuxt.hook('page:finish', () => {
      const pageEnd = Date.now()
      loadTime.value = Number((pageEnd - navStart).toFixed(2))
    })

    return {
      provide: {
        _loadTime: loadTime,
      },
    }
  },
})
