<template>
  <UContextMenuRegionContent v-slot="{ payload }" name="browseRoom">
    <MenuItemCopyUrl :id="payload?.room.room_id" type="roomId" />
  </UContextMenuRegionContent>
</template>
