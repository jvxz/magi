<script lang="ts" setup>
const { sortedRecentRooms } = useRecentRooms()
</script>

<template>
  <div class="p-3 flex flex-col gap-2.5">
    <div v-for="recentRoom in sortedRecentRooms" :key="recentRoom.key">
      <URoomShowcaseCardRoot :room="recentRoom.key" v-slot="{ room }">
        <URoomShowcaseCardContent>
          <URoomShowcaseCardTitle class="flex items-center">
            <span>{{ room?.name }}</span>
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription>
            <!-- <template v-if="recentRoom.parentSpaceId">
              <MatrixAvatar :room="recentRoom.parentSpaceId" class="size-3" />

              <UInlineSeparator />
            </template> -->

            <!-- <span>Last visited: <NuxtTime :datetime="recentRoom.lastVisited" /></span> -->

            <UseRoom v-if="recentRoom.parentSpaceId" :room="recentRoom.parentSpaceId" v-slot="{ room }">
              <span> {{ room?.name }}</span>
            </UseRoom>
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardContent>
      </URoomShowcaseCardRoot>
    </div>
  </div>
</template>
