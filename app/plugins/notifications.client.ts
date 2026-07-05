export default defineNuxtPlugin({
  name: 'notifications',
  parallel: true,
  setup: () => ({
    provide: {
      notify: useNotifications().notify,
    },
  }),
})
