<script lang="ts" setup>
defineProps<ContextMenuRegions['member']>()

const { openDialog } = useGlobalDialog()
</script>

<template>
  <template v-if="member">
    <UContextMenuItem> Mention </UContextMenuItem>
    <UContextMenuItem> Message {{ member.name }} </UContextMenuItem>
    <UContextMenuSeparator />
    <UContextMenuItem @select="openDialog('avatar', { label: member.name, user: member.user ?? member.userId })">
      View avatar
    </UContextMenuItem>
  </template>
</template>
