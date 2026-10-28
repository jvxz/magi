<script lang="ts" setup>
import type { UMenuItemEmits } from '../u/menu-item.vue'

defineProps<{ payload: GlobalDialogMap['avatar'] | undefined }>()
defineEmits<UMenuItemEmits>()

const { openDialog } = useGlobalDialog()
</script>

<template>
  <UMenuItem :disabled="!payload" @select="($emit('select', $event), payload && openDialog('image', payload))">
    <Icon :name="ICON__VIEW_AVATAR" />
    <span>View avatar</span>
  </UMenuItem>
</template>
