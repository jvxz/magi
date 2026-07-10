<script lang="ts" setup>
const { payload } = defineProps<{ payload: ContextMenuRegions['invite'] | undefined }>()

const { accept, decline } = useRoomInviteActions(() => payload?.roomId)
const { isPending: isAccepting } = accept
const { isPending: isDeclining } = decline

const disabled = computed(() => isAccepting.value || isDeclining.value)
</script>

<template>
  <UContextMenuItem :disabled @select="accept.mutate()"> Accept </UContextMenuItem>
  <UContextMenuItem :disabled @select="decline.mutate()"> Decline </UContextMenuItem>
</template>
