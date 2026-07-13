<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'

defineProps<{ event: MatrixEvent }>()
</script>

<template>
  <div class="mt-4.25 px-6 flex items-center">
    <USeparator class="w-full flex-1" />

    <NuxtTime
      :datetime="event.getTs()"
      v-bind="PROPS__NUXT_TIME_SHORT_DATE"
      class="shrink-0 px-2 text-muted-foreground text-sm tabular-nums"
    />

    <USeparator class="w-full flex-1" />
  </div>
</template>
