<script lang="ts" setup>
const { open, state } = useGlobalDialog()
</script>

<template>
  <DialogLeave v-if="state?.name === 'leave'" v-model:open="open" :room="state.room" />
  <DialogInvite v-if="state?.name === 'invite'" v-model:open="open" :room="state.roomId" />
</template>
