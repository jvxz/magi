<script lang="ts" setup>
import type { UInputTemplateRef } from '~/components/u/input.vue'
import { required } from '@regle/rules'

const props = defineProps<{
  servers: string[]
}>()

const emit = defineEmits<{
  serverSubmit: [value: string]
}>()

const open = shallowRef(false)

const { r$ } = useRegle({ homeserver: '' }, {
  homeserver: {
    exists: withMessage(v => v ? !props.servers.includes(v.toString()) : true, 'This homeserver is already added'),
    required: withMessage(required, 'Value must not be empty'),
  },
})

function handleSubmit() {
  if (!r$.homeserver.$value)
    return

  open.value = false
  emit('serverSubmit', r$.homeserver.$value)
}

const inputRef = useTemplateRef<UInputTemplateRef>('input')
onStartTyping(() => {
  if (inputRef.value)
    inputRef.value.inputRef?.focus()
})
</script>

<template>
  <UAlertDialogRoot
    v-model:open="open"
    @update:open="(e) => {
      if (e) r$.$reset()
    }"
  >
    <UAlertDialogTrigger as-child>
      <UAsideListButton>
        <UAsideListButtonIcon icon="tabler:plus" />
        <span class="font-medium">Add server</span>
      </UAsideListButton>
    </UAlertDialogTrigger>

    <UAlertDialogContent>
      <VisuallyHidden>
        <UAlertDialogTitle>
          Enter a homeserver URL
        </UAlertDialogTitle>
      </VisuallyHidden>

      <form class="contents" @submit.prevent="handleSubmit">
        <UInput
          ref="input"
          v-model="r$.$value.homeserver"
          required
          placeholder="matrix.org"
        />
      </form>

      <UAlertDialogFooter class="flex w-full items-center">
        <Transition name="zoom">
          <p v-if="r$.homeserver.$error" class="text-sm text-danger mr-auto">
            {{ r$.homeserver.$errors[0] }}
          </p>
        </Transition>

        <div class="flex gap-2 items-center">
          <UAlertDialogCancel>
            Cancel
          </UAlertDialogCancel>

          <UAlertDialogAction :disabled="!r$.$dirty || r$.$error" @click="handleSubmit">
            Add server
          </UAlertDialogAction>
        </div>
      </UAlertDialogFooter>
    </UAlertDialogContent>
  </UAlertDialogRoot>
</template>
