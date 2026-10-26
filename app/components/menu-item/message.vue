<script lang="ts" setup>
import type { RoomMember, User } from 'matrix-js-sdk'

import type { UMenuItemEmits } from '../u/menu-item.vue'

defineProps<{ user: User | RoomMember }>()
defineEmits<UMenuItemEmits>()
</script>

<template>
  <UMenuItem @select="$emit('select', $event)">
    <Icon :name="ICON__MESSAGE" />
    <span>Message {{ resolveUserName(user) }}</span>
  </UMenuItem>
</template>
