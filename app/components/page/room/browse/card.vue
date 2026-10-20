<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<
  PrimitiveProps & {
    room: HierarchyRoom
    suggested?: boolean
  }
>()

const dialogSrc = useResolveAvatarUrl(() => props.room.avatar_url, { size: 'full' })
</script>

<template>
  <UContextMenuRegionTrigger as-child region="browseRoom" :value="{ room }">
    <URoomShowcaseCardRoot class="border-0 flex gap-2 h-fit shadow-none items-center" :room="room.room_id" group>
      <URoomShowcaseCardImage
        as-child
        :dialog="dialogSrc ? { type: 'image', src: dialogSrc, label: room.name ?? room.room_id } : undefined"
      >
        <MatrixAvatar square :src="props.room.avatar_url" :alt="room.name ?? room.room_id" />
      </URoomShowcaseCardImage>

      <URoomShowcaseCardContent>
        <URoomShowcaseCardHeader class="shrink">
          <URoomShowcaseCardTitle class="flex gap-2 max-h-1em items-center">
            <span class="truncate">{{ room.name ?? room.room_id }}</span>

            <UBadge v-if="suggested" size="sm" class="shrink-0"> Suggested </UBadge>
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription>
            <span class="shrink-0"> {{ room.num_joined_members }} members </span>

            <template v-if="room.topic">
              <UInlineSeparatorRoot />
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
