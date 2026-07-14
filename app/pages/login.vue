<script lang="ts" setup>
import { pipe, required } from '@regle/rules'

const homeservers = ['matrix.org', 'matrix.4d2.org', 'matrix.oblak.be']

const validHomeserver = getValidHomeserverRule()

const { r$ } = useRegle(
  {
    homeserver: 'matrix.org',
    password: '',
    username: '',
  },
  {
    homeserver: pipe([required, validHomeserver], { debounce: 500 }),
    password: { required },
    username: { noSpaces, required },
  },
)
useHomeserverConfig(toRef(r$.homeserver, '$value'))

const { login } = useAuth()

async function handleLogin() {
  await login.mutateAsync({
    baseUrl: r$.$value.homeserver,
    identifier: {
      type: 'm.id.user',
      user: r$.$value.username,
    },
    password: r$.$value.password,
    type: 'm.login.password',
  })

  return navigateTo('/app', { external: true })
}
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <UCard class="px-0 py-12 container flex size-fit w-lg shadow-xl">
      <div class="flex flex-col gap-10 h-full w-full">
        <div class="text-center flex flex-col gap-1 justify-center">
          <h1 class="text-2xl font-medium">Welcome back!</h1>
          <h2 class="text-muted-foreground">We're so excited to see you again!</h2>
        </div>
        <div class="px-12 flex flex-col gap-4 items-center justify-center">
          <FormPrimitive
            label="Homeserver"
            required
            :is-loading="r$.$pending"
            :ui="{ container: 'text-base w-full' }"
            :error="r$.homeserver.$errors"
          >
            <UAutocompleteRoot v-model:model-value="r$.$value.homeserver" class="group" reset-search-term-on-blur>
              <UAutocompleteAnchor
                class="has-focus-visible:border-border-strong"
                :class="cn(inputStyles(), 'bg-surface group-data-[error]:border-danger')"
              >
                <UAutocompleteInput :show-icon="false" data-testid="homeserver-input" class="shrink cursor-text" />
                <UAutocompleteTrigger class="-mr-1.5">
                  <Icon name="tabler:chevron-down" class="text-muted-foreground size-3.25!" />
                </UAutocompleteTrigger>
              </UAutocompleteAnchor>

              <UAutocompleteContent hide-when-empty>
                <UAutocompleteViewport>
                  <UAutocompleteEmpty />
                  <UAutocompleteGroup>
                    <UAutocompleteItem v-for="server in homeservers" :key="server" :value="server">
                      {{ server }}
                    </UAutocompleteItem>
                  </UAutocompleteGroup>
                </UAutocompleteViewport>
              </UAutocompleteContent>
            </UAutocompleteRoot>
          </FormPrimitive>
          <div class="flex gap-2 h-0.5lh w-full items-center justify-center">
            <USeparator v-if="!login.error.value" />
            <template v-else>
              <USeparator class="bg-danger shrink" />
              <p class="text-sm text-danger text-center shrink-0 h-1lh -translate-y-0.5">
                {{ login.error.value && login.error.value?.message }}
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
              :is-loading="login.isPending.value"
              :disabled="r$.$invalid"
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
    </UCard>
  </div>
</template>
