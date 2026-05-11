<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<PrimitiveProps & {
  room: HierarchyRoom
  suggested?: boolean
}>()

const src = useResolveAvatarUrl(() => props.room.avatar_url ?? undefined)
</script>

<template>
  <UCard
    :as="as"
    :as-child="asChild"
    :class="cn('w-full relative hover:(border-foreground/50 bg-card-lighter) h-18 p-3.5 border flex-row gap-3.5 ', $attrs.class)"
  >
    <MatrixAvatar
      :src
      class="rounded-sm shrink-0 w-fit aspect-square"
    />

    <div class="flex flex-col w-full justify-around tabular-nums">
      <div class="flex gap-2 max-h-1em items-center">
        <p class="text-sm font-medium truncate">
          {{ room.name ?? room.room_id }}
        </p>

        <UBadge v-if="suggested" size="sm">
          Suggested
        </UBadge>
      </div>

      <div class="text-xs text-muted-foreground truncate">
        <span class="text-muted-foreground shrink-0">
          {{ room.num_joined_members }} members
        </span>

        <template v-if="room.topic">
          <UInlineSeparator />
          <span>
            {{ room.topic }}
          </span>
        </template>
      </div>
    </div>
  </UCard>
</template>
