<script lang="ts" setup>
import { DialogCodeViewer, DialogDeleteMessage, DialogImage, DialogInvite, DialogLeave } from '#components'

const { dialogKey, open, state } = useGlobalDialog()

const dialogs: Record<GlobalDialog, Component> = {
  codeViewer: DialogCodeViewer,
  deleteMessage: DialogDeleteMessage,
  image: DialogImage,
  invite: DialogInvite,
  leave: DialogLeave,
}
</script>

<template>
  <component
    :is="dialogs[state.name]"
    v-if="state"
    :key="`${state.name}-${dialogKey}`"
    v-model:open="open"
    v-bind="state"
  />

  <DialogUia />
</template>
