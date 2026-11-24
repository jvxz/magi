import type { NuxtSecurityRouteRules } from 'nuxt-security'

// nuxt-security 2.7.0 only augments nitropack/types while nitro v3 route rules live in h3/rules
declare module 'h3/rules' {
  interface RouteRuleConfig {
    security?: NuxtSecurityRouteRules
  }
}

export {}
