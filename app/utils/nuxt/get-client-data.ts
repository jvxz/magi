import type { NuxtApp } from '#app'

export const getClientData = (key: string, nuxt: NuxtApp) => nuxt.payload.data?.[key] || nuxt.static?.data?.[key] || undefined
