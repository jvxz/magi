<script lang="ts" setup>
import { createClient } from 'matrix-js-sdk'

const props = defineProps<{ homeserver: string | undefined; disabled: boolean; tooltipDisabled: boolean }>()

const homeserver = toRef(props, 'homeserver')

const { data: loginFlows } = useHomeserverLoginFlows(debouncedRef(homeserver, 500))
const ssoLoginFlow = computed(() => getSSOFlow(loginFlows.value?.flows ?? []))

const router = useRouter()
const requestUrl = useRequestURL()
const redirectUrl = computed(() => new URL(router.resolve('/login/sso').href, requestUrl.origin).href)
const resolvedHomeserverBaseUrl = useResolveHomeserverBaseUrl(homeserver)

const { data: ssoLoginUrl } = useQuery({
  queryFn: () => {
    if (!resolvedHomeserverBaseUrl.value) return
    const client = createClient({ baseUrl: resolvedHomeserverBaseUrl.value })
    return client.getSsoLoginUrl(redirectUrl.value)
  },
  queryKey: $qk.homeserverSSOUrl(homeserver),
  watch: [redirectUrl],
})

const handleClick = async () => {
  assert(resolvedHomeserverBaseUrl.value, 'no resolved homeserver base URL when attempting to login via SSO')
  await idb.set(SSO_BASE_URL_KEY, resolvedHomeserverBaseUrl.value)
  return navigateTo(ssoLoginUrl.value, { external: true })
}
</script>

<template>
  <UTooltipRoot :disabled="!!ssoLoginFlow || tooltipDisabled">
    <UTooltipTrigger as-child>
      <span tabindex="0" class="w-full">
        <UButton
          @click="handleClick"
          :disabled="!ssoLoginFlow || !ssoLoginUrl || disabled"
          class="w-full"
          variant="soft"
          size="lg"
        >
          Log in via SSO <Icon name="tabler:key" />
          <!-- <NuxtLink :to="ssoLoginUrl" external> </NuxtLink> -->
        </UButton>
      </span>
    </UTooltipTrigger>

    <UTooltipContent> SSO login is unsupported for this homeserver </UTooltipContent>
  </UTooltipRoot>
</template>
