<script lang="ts" setup>
import { required } from '@regle/rules'
import { MatrixError } from 'matrix-js-sdk'

import { injectLoginPageEditableStateContext } from '~/pages/login/new.vue'

const { editableInput: homeserverUrl, error, isLoggingIn, isSSONavigating } = injectLoginPageEditableStateContext()

const { r$ } = useRegle(
  {
    password: '',
    username: '',
  },
  {
    password: { required },
    username: { noSpaces, required },
  },
)

watchDeep(
  () => r$.$value,
  () => (error.value = undefined),
)

const canLogin = computed(() => r$.$ready && !error.value && !isSSONavigating.value)

const { login } = useAuth()
async function handleLogin() {
  if (!canLogin.value) return

  isLoggingIn.value = true

  const res = await login.executeImmediate({
    baseUrl: homeserverUrl.value,
    identifier: {
      type: 'm.id.user',
      user: r$.username.$value!,
    },
    password: r$.password.$value!,
    type: 'm.login.password',
  })

  if (res instanceof MatrixError) {
    isLoggingIn.value = false
    return (error.value = parseError(res))
  }

  return navigateTo('/app', {
    external: true,
  })
}
</script>

<template>
  <form class="contents" @submit.prevent>
    <FormInput
      v-model:model-value="r$.username.$value"
      label="Username"
      :error="r$.username.$errors"
      required
      @keydown.enter="handleLogin"
    />
    <FormInput
      v-model:model-value="r$.password.$value"
      label="Password"
      required
      type="password"
      :error="r$.password.$errors"
      @keydown.enter="handleLogin"
    />

    <UButton
      :disabled="!canLogin"
      :is-loading="login.isLoading.value"
      variant="default"
      size="lg"
      class="mt-1 w-full"
      @click="handleLogin"
    >
      <span>Log in</span>
    </UButton>
  </form>
</template>
