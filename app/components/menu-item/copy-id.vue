<script lang="ts" setup>
import type { UMenuItemEmits } from '../u/menu-item.vue'

defineProps<{ id: string | undefined }>()
defineEmits<UMenuItemEmits>()

const { copy, isSupported } = useClipboard()
</script>

<template>
  <UMenuItem :disabled="!isSupported || !id" @select="($emit('select', $event), isSupported && id && copy(id))">
    <Icon :name="ICON__COPY_ID" />
    <span>Copy ID</span>
  </UMenuItem>
</template>
