<script lang="ts" setup>
import { required } from '@regle/rules'

const open = shallowRef(false)

const { r$ } = useRegle(
  { encrypt: false, userId: '' },
  {
    userId: {
      required: withMessage(required, 'User ID is required'),
      validId: withMessage(isUserId, 'Invalid user ID'),
    },
  },
)

whenever(() => open.value, r$.$reset)

const { executeImmediate: handleCreate, isLoading: isCreating } = useAsyncState(async () => {
  r$.$touch()

  const { valid } = await r$.$validate()
  if (!valid) return

  await delay(1000)

  open.value = false
}, undefined)
</script>

<template>
  <UDialogRoot v-model:open="open">
    <UTooltipRoot>
      <UDialogTrigger as-child>
        <UTooltipTrigger as-child>
          <button class="text-muted-foreground flex cursor-pointer items-center justify-center">
            <Icon name="tabler:plus" />
          </button>
        </UTooltipTrigger>
      </UDialogTrigger>
      <UTooltipContent> Create chat </UTooltipContent>
    </UTooltipRoot>

    <UDialogContent>
      <UDialogHeader>
        <UDialogTitle> Create chat </UDialogTitle>
        <UDialogDescription> Enter a user's ID to create a chat with them </UDialogDescription>
      </UDialogHeader>

      <form class="flex flex-col gap-2" @submit.prevent="handleCreate">
        <FormInput
          v-model="r$.userId.$value"
          label="User ID"
          placeholder="@alice:matrix.org"
          :error="r$.userId.$errors"
          disable-pw
          required
        />

        <UCheckboxCardRoot v-model:model-value="r$.encrypt.$value" class="w-full">
          <UCheckboxCardIcon name="tabler:lock" />
          <UCheckboxCardContent>
            <UCheckboxCardLabel> Encrypt room </UCheckboxCardLabel>
            <UCheckboxCardDescription>
              Enable end-to-end encryption for this room.
              <span class="font-medium underline">Once the room is created, this cannot be changed.</span>
            </UCheckboxCardDescription>
          </UCheckboxCardContent>

          <UCheckboxCardInput />
        </UCheckboxCardRoot>
      </form>

      <UDialogFooter>
        <UDialogClose variant="ghost"> Cancel </UDialogClose>
        <UButton :disabled="r$.$invalid" :is-loading="isCreating" @click="handleCreate">
          <span>Create</span>
        </UButton>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
