<script lang="ts" setup>
import { required } from '@regle/rules'

definePageMeta({
  middleware: 'auth',
})

const homeservers = ['matrix.org', 'matrix.4d2.org', 'matrix.oblak.be']

const { r$ } = useRegle(
  {
    homeserver: 'matrix.org',
    password: '',
    username: '',
  },
  {
    homeserver: { required },
    password: { required },
    username: { noSpaces, required },
  },
)

const runCheck = useDebounceFn(async () => r$.$value.homeserver?.trim() ? validateHomeserver(r$.$value.homeserver.trim(), true) : false, 300)
const { data: isHomeserverValid, error: homeserverError, execute, pending } = useAsyncData(
  runCheck,
  {
    default: () => true,
    immediate: true,
    lazy: false,
    server: false,
    timeout: 10000,
  },
)

const { login } = useAuth()
const { error: loginError, isPending: loginPending, mutate: handleLogin } = useMutation({
  mutationFn: async () => {
    await login({
      baseUrl: r$.$value.homeserver,
      identifier: {
        type: 'm.id.user',
        user: r$.$value.username,
      },
      password: r$.$value.password,
      type: 'm.login.password',
    })

    return navigateTo('/app')
  },
})

watch(() => r$.$value.homeserver, () => {
  homeserverError.value = undefined
  execute()
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <div class="py-12 rounded bg-card-lighter container flex size-fit w-lg shadow-xl">
      <div class="flex flex-col gap-10 h-full w-full">
        <div class="text-center flex flex-col gap-1 justify-center">
          <h1 class="text-2xl font-medium">
            Welcome back!
          </h1>
          <h2 class="text-muted-foreground">
            We're so excited to see you again!
          </h2>
        </div>
        <div class="px-12 flex flex-col gap-4 items-center justify-center">
          <FormPrimitive
            label="Homeserver"
            required
            :is-loading="pending"
            class="text-base w-full"
            :error="(homeserverError ? upperFirst(homeserverError.message) : undefined) ?? r$.homeserver.$errors"
          >
            <UAutocompleteRoot
              v-model:model-value="r$.$value.homeserver"
              class="group"
              reset-search-term-on-blur
            >
              <UAutocompleteAnchor class="border-muted bg-card h-10 group-data-[error]:border-danger">
                <UAutocompleteInput :show-icon="false" data-testid="homeserver-input" />
                <UAutocompleteTrigger>
                  <Icon name="tabler:chevron-down" class="text-muted-foreground size-3.25!" />
                </UAutocompleteTrigger>
              </UAutocompleteAnchor>
              <UAutocompleteContent hide-when-empty>
                <UAutocompleteViewport>
                  <UAutocompleteEmpty />
                  <UAutocompleteGroup>
                    <UAutocompleteItem
                      v-for="server in homeservers"
                      :key="server"
                      :value="server"
                    >
                      {{ server }}
                    </UAutocompleteItem>
                  </UAutocompleteGroup>
                </UAutocompleteViewport>
              </UAutocompleteContent>
            </UAutocompleteRoot>
          </FormPrimitive>
          <div class="flex gap-2 h-0.5lh w-full items-center justify-center">
            <USeparator v-if="!loginError" />
            <template v-else>
              <USeparator class="bg-danger shrink" />
              <p class="text-sm text-danger text-center shrink-0 h-1lh -translate-y-0.5">
                {{ loginError && loginError.message }}
              </p>
              <USeparator class="bg-danger shrink" />
            </template>
          </div>

          <form class="contents" @submit.prevent="() => handleLogin()">
            <FormInput
              v-model:model-value="r$.$value.username"
              label="Username"
              required
              data-testid="username-input"
              :ui="{ input: 'w-full h-10', container: 'w-full' }"
              :error="r$.username.$errors"
              @keydown.enter="handleLogin"
            />
            <FormInput
              v-model:model-value="r$.$value.password"
              label="Password"
              type="current-password"
              required
              data-testid="password-input"
              :ui="{ input: 'w-full h-10', container: 'w-full' }"
              :error="r$.password.$errors"
              @keydown.enter="handleLogin"
            />
            <UButton
              :is-loading="loginPending"
              :disabled="!isHomeserverValid || r$.$invalid"
              class="w-full"
              variant="default"
              type="submit"
              size="lg"
            >
              <p>Log In</p>
            </UButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
