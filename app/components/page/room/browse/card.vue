<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<
  PrimitiveProps & {
    room: HierarchyRoom
    suggested?: boolean
  }
>()

const manualAvatarSrc = useResolveAvatarUrl(() => props.room.avatar_url)
</script>

<template>
  <UContextMenuRegionTrigger as-child region="browseRoom" :value="{ room }">
    <URoomShowcaseCardRoot class="border-0 flex gap-2 h-fit shadow-none items-center" :room="room.room_id" group>
      <URoomShowcaseCardAvatar :manual-avatar-src :room="room.room_id" class="shrink-0 h-10 aspect-square" />

      <URoomShowcaseCardContent>
        <URoomShowcaseCardHeader class="shrink">
          <URoomShowcaseCardTitle class="flex gap-2 max-h-1em items-center">
            <span class="truncate">{{ room.name ?? room.room_id }}</span>

            <UBadge v-if="suggested" size="sm" class="shrink-0"> Suggested </UBadge>
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription>
            <span class="shrink-0"> {{ room.num_joined_members }} members </span>

            <template v-if="room.topic">
              <UInlineSeparator />
              <span>
                {{ room.topic }}
              </span>
            </template>
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardHeader>
      </URoomShowcaseCardContent>
    </URoomShowcaseCardRoot>
  </UContextMenuRegionTrigger>
</template>
