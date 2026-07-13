<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'

defineProps<{ event: MatrixEvent }>()
</script>

<template>
  <div class="mt-4.25 px-6 flex items-center">
    <USeparator class="flex-1 w-full" />

    <NuxtTime
      :datetime="event.getTs()"
      v-bind="PROPS__NUXT_TIME_SHORT_DATE"
      class="text-sm text-muted-foreground px-2 shrink-0 tabular-nums"
    />

    <USeparator class="flex-1 w-full" />
  </div>
</template>
