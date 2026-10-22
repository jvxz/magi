<script lang="ts" setup>
import type { RoomMember } from 'matrix-js-sdk'

import type { UMenuItemEmits } from '../u/menu-item.vue'

defineProps<{ roomMember: RoomMember }>()
defineEmits<UMenuItemEmits>()
</script>

<template>
  <UMenuItem @select="$emit('select', $event)">
    <Icon :name="ICON__AT" />
    <span>Mention {{ resolveUserName(roomMember) }}</span>
  </UMenuItem>
</template>
