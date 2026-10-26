<script lang="ts" setup>
import type { UMenuItemEmits } from '../u/menu-item.vue'

const { payload } = defineProps<{ payload: GlobalDialogMap['invite'] | undefined }>()
defineEmits<UMenuItemEmits>()

const { openDialog } = useGlobalDialog()

const { self } = useSelf()
const canInvite = useRoomComputed(
  () => payload?.room,
  r => self.value && r?.canInvite(self.value.userId),
)
</script>

<template>
  <UMenuItem :disabled="!canInvite" @select="($emit('select', $event), payload && openDialog('invite', payload))">
    <Icon :name="ICON__INVITE" />
    <span>Invite</span>
  </UMenuItem>
</template>
