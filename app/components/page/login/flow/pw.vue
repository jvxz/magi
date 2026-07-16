<script lang="ts" setup>
import { required } from '@regle/rules'
import { MatrixError } from 'matrix-js-sdk'

import { injectLoginPageEditableStateContext } from '~/pages/login/new.vue'

const { editableInput: homeserverUrl, error, isSSONavigating, isLoggingIn } = injectLoginPageEditableStateContext()

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
      label="Username"
      @keydown.enter="handleLogin"
      v-model:model-value="r$.username.$value"
      :error="r$.username.$errors"
      required
    />
    <FormInput
      label="Password"
      @keydown.enter="handleLogin"
      required
      type="password"
      v-model:model-value="r$.password.$value"
      :error="r$.password.$errors"
    />

    <UButton
      @click="handleLogin"
      :disabled="!canLogin"
      :is-loading="login.isLoading.value"
      variant="default"
      size="lg"
      class="w-full mt-1"
    >
      <span>Log in</span>
    </UButton>
  </form>
</template>
