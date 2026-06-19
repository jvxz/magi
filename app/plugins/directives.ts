export default defineNuxtPlugin({
  parallel: true,
  setup: ({ vueApp }) => {
    vueApp.directive('disable-pw', {
      mounted: (el, binding) => {
        const shouldDisable = binding.value !== false
        if (!shouldDisable) return

        el.setAttribute('data-1p-ignore', '')
        el.setAttribute('data-bwignore', '')
        el.setAttribute('data-lpignore', 'true')
        el.setAttribute('data-dashlane-ignore', 'true')

        el.setAttribute('autocomplete', 'off')
      },

      updated: (el, binding) => {
        if (binding.value === false && binding.oldValue !== false) {
          el.removeAttribute('data-1p-ignore')
          el.removeAttribute('data-bwignore')
          el.removeAttribute('data-lpignore')
          el.removeAttribute('data-dashlane-ignore')
          el.removeAttribute('autocomplete')
        } else if (binding.value !== false && binding.oldValue === false) {
          el.setAttribute('data-1p-ignore', '')
          el.setAttribute('data-bwignore', '')
          el.setAttribute('data-lpignore', 'true')
          el.setAttribute('data-dashlane-ignore', 'true')
          el.setAttribute('autocomplete', 'off')
        }
      },
    })
  },
})
