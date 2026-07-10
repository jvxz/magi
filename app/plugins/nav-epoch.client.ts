export default defineNuxtPlugin({
  parallel: true,
  setup: () => {
    const navEpoch = ref(0)

    const router = useRouter()
    router.afterEach(() => navEpoch.value++)

    return {
      provide: { navEpoch },
    }
  },
})
