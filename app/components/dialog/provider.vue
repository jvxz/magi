<script lang="ts" setup>
import {
  DialogCodeViewer,
  DialogDeleteMessage,
  DialogRoomSettings,
  DialogImage,
  DialogInvite,
  DialogLeave,
  DialogText,
} from '#components'

const { dialogKey, open, state } = useGlobalDialog()

const dialogs: Record<GlobalDialog, Component> = {
  codeViewer: DialogCodeViewer,
  deleteMessage: DialogDeleteMessage,
  image: DialogImage,
  invite: DialogInvite,
  leave: DialogLeave,
  roomSettings: DialogRoomSettings,
  text: DialogText,
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
