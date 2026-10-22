<script lang="ts" setup>
defineProps<ContextMenuRegions['member']>()
</script>

<template>
  <template v-if="member">
    <MenuItemMention :roomMember="member" />
    <!-- <UContextMenuItem> Message {{ member.name }} </UContextMenuItem> -->
    <MenuItemMessage :user="member" />
    <UContextMenuSeparator />
    <MenuItemViewAvatar :payload="{ label: member.name, member, room: roomId, type: 'roomMember' }" />
  </template>
</template>
