import type { NuxtTimeProps } from '#app'

export const PROPS__NUXT_TIME_FULL: Omit<NuxtTimeProps, 'datetime'> = {
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
}
