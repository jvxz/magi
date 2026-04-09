<script lang="ts" setup>
import type { MatrixEvent } from 'matrix-js-sdk'

const props = defineProps<{
  event: MatrixEvent
}>()

const { client } = useMatrixClient()

const member = getMember(client.value, props.event.getSender(), props.event.getRoomId())
const content = props.event.getContent()

const displayName = member?.displayName ?? props.event.getSender()

const isEncrypted = computed(() => {
  if (!props.event.isEncrypted())
    return false

  return props.event.getClearContent() === null
})
</script>

<template>
  <PageRoomEvent
    :event-id="props.event.getId()"
    :event-type="props.event.getType()"
    class="flex gap-4 select-text"
  >
    <MatrixAvatar
      :user="member"
      :size="32"
      class="mt-1 shrink-0 size-10"
    />

    <div class="flex flex-1 flex-col">
      <p class="font-medium space-x-2">
        <span class="text-sm">{{ displayName }}</span>
        <NuxtTime
          :datetime="props.event.getTs()"
          hour="numeric"
          minute="numeric"

          class="text-xs text-muted-foreground"
        />
      </p>
      <p v-if="!isEncrypted" class="">
        {{ content.body }}
      </p>
      <p v-else class="">
        Encrypted message
      </p>
    </div>
  </PageRoomEvent>
</template>
