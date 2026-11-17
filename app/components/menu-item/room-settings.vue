<script lang="ts" setup>
import type { UMenuItemEmits } from '../u/menu-item/index.vue'

const { room } = defineProps<{ room?: GlobalDialogMap['roomSettings']['room'] }>()
defineEmits<UMenuItemEmits>()

const { openDialog } = useGlobalDialog()

const isRoomSpace = useRoomComputed(() => room, r => (r ? isSpace(r) : false))

const handleOpen = () => {
  if (!room) return
  openDialog('roomSettings', { room })
}
</script>

<template>
  <UMenuItem @select="($emit('select', $event), handleOpen())">
    <Icon :name="ICON__SETTINGS" />
    <span>{{ isRoomSpace ? 'Space' : 'Room' }} settings</span>
  </UMenuItem>
</template>
