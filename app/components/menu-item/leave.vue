<script lang="ts" setup>
import type { UMenuItemEmits } from '../u/menu-item.vue'

const props = defineProps<{ type: 'room' | 'space'; id: MaybeRoomOrId | undefined }>()
defineEmits<UMenuItemEmits>()

const { openDialog } = useGlobalDialog()
const room = useRoom(() => props.id)
</script>

<template>
  <UMenuItem
    :disabled="!room"
    variant="danger"
    @select="($emit('select', $event), room && openDialog('leave', { room }))"
  >
    <Icon :name="ICON__LEAVE" />
    <span>Leave {{ type }}</span>
  </UMenuItem>
</template>
