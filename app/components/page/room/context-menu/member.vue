<script lang="ts" setup>
defineProps<ContextMenuRegions['member']>()
</script>

<template>
  <template v-if="member">
    <UContextMenuItem> Mention </UContextMenuItem>
    <UContextMenuItem> Message {{ member.name }} </UContextMenuItem>
    <UContextMenuSeparator />
    <UContextMenuItem> View avatar </UContextMenuItem>
  </template>
</template>
