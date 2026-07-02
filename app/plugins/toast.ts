export default defineNuxtPlugin({
  parallel: true,
  setup: () => ({
    provide: {
      toast: useToast(),
    },
  }),
})
