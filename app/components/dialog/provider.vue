<script lang="ts" setup>
import {
  DialogCodeViewer,
  DialogDeleteMessage,
  DialogRoomSettings,
  DialogImage,
  DialogInvite,
  DialogLeave,
  DialogText,
  DialogEditAvatar,
} from '#components'

const { stack } = useGlobalDialog()

const dialogs: Record<GlobalDialog, Component> = {
  codeViewer: DialogCodeViewer,
  deleteMessage: DialogDeleteMessage,
  editAvatar: DialogEditAvatar,
  image: DialogImage,
  invite: DialogInvite,
  leave: DialogLeave,
  roomSettings: DialogRoomSettings,
  text: DialogText,
}
</script>

<template>
  <component :is="dialogs[item.name]" v-for="item in stack" :key="item.id" v-bind="item" v-model:open="item.open" />

  <DialogUia />
</template>
