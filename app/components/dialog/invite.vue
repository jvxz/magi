<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'

import { string } from '@regle/rules'
import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<
  DialogRootProps & {
    room: Room | undefined
  }
>()
const emits = defineEmits<DialogRootEmits>()

const { self } = useSelf()
const { r$ } = useRegle(
  {
    reason: '',
    userId: '',
  },
  {
    reason: { string: withMessage(string, 'The reason must be a string') },
    userId: {
      ...regleUserIdDefs,
      disallowSelf: withMessage(e => isString(e) && e !== self.value?.userId, 'You cannot invite yourself'),
    },
  },
)

const inputEl = useTemplateRef('inputEl')

const delegated = reactiveOmit(props, 'open')
const forwarded = useForwardPropsEmits(delegated, emits)
whenever(
  () => forwarded.value.open,
  () => r$.$reset({ toInitialState: true }),
)

const open = useVModel(props, 'open', emits)
const { invite } = useRoomActions(() => props.room)
const { executeImmediate: handleInvite, isLoading: isInviting } = useAsyncState(async () => {
  if (r$.$invalid || !r$.userId.$value) return

  await invite.mutateAsync({ userId: r$.userId.$value })
  open.value = false
}, undefined)
</script>

<template>
  <UDialogRoot
    v-bind="forwarded"
    :open
    @update:open="
      e => {
        emits('update:open', e)

        if (isInviting) return
        open = e
      }
    "
  >
    <UDialogContent v-if="room" @open-auto-focus.prevent="inputEl?.$el.focus">
      <UDialogHeader :close-disabled="isInviting">
        <UDialogTitle class="truncate"> Invite to "{{ resolveRoomName(room) }}" </UDialogTitle>
      </UDialogHeader>

      <form @submit.prevent="handleInvite" class="flex flex-col gap-2">
        <FormInput
          disable-pw
          ref="inputEl"
          label="User ID"
          :error="r$.userId.$errors"
          v-model:model-value="r$.userId.$value"
          placeholder="@alice:matrix.org"
          required
        />

        <FormInput
          disable-pw
          label="Reason"
          :error="r$.reason.$errors"
          v-model:model-value="r$.reason.$value"
          textarea
        />
      </form>

      <UDialogFooter>
        <UDialogClose :disabled="isInviting" variant="ghost"> Close </UDialogClose>
        <UButton :is-loading="isInviting" @click="handleInvite" :disabled="r$.$invalid"> <span>Invite</span> </UButton>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
