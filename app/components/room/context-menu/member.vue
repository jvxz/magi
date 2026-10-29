<script lang="ts" setup>
defineProps<ContextMenuRegions['member']>()
</script>

<template>
  <template v-if="member">
    <MenuItemMention :room-member="member" />
    <!-- <UContextMenuItem> Message {{ member.name }} </UContextMenuItem> -->
    <MenuItemMessage :user="member" />
    <UContextMenuSeparator />
    <MenuItemViewAvatar :payload="{ alt: member.name, member, room: roomId, type: 'roomMember' }" />
  </template>
</template>
