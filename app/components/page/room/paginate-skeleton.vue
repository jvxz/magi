<script lang="ts" setup>
const colCounts = [2, 3, 5, 6]
const sizes = [48, 64, 80, 96, 112, 128]

const rows = Array.from({ length: 4 }, () => ({
  header: sample(sizes),
  lines: Array.from({ length: sample(colCounts) }, () =>
    Array.from({ length: sample(colCounts) }, () => sample(sizes))),
}))
</script>

<template>
  <div class="pb-4.25" data-ignore>
    <div
      v-for="(row, idx) in rows"
      :key="idx"
      class="pb-4.25"
    >
      <PageRoomEvent
        event-id=""
        event-type=""
        class="hover:bg-transparent"
      >
        <PageRoomEventMessageRoot>
          <PageRoomEventMessageAvatar :user="undefined" ghost />
          <PageRoomEventMessageContent class="gap-1.5 flex flex-col translate-y-1">
            <template #header>
              <USkeleton
                class="h-4 relative overflow-clip after:bg-white/15 after:size-full after:content-[''] after:absolute"
                :style="{ width: `${row.header}px` }"
              />
            </template>

            <div
              v-for="(line, idx) in row.lines"
              :key="idx"
              class="flex gap-1.5"
            >
              <USkeleton
                v-for="(size, idx) in line"
                :key="idx"
                class="h-4"
                :style="{ width: `${size}px` }"
              />
            </div>
          </PageRoomEventMessageContent>
        </PageRoomEventMessageRoot>
      </PageRoomEvent>
    </div>
  </div>
</template>
