<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    PrimitiveProps & { room?: MaybeRoomOrId | undefined; withAvatar?: boolean; manualAvatarSrc?: string | undefined }
  >(),
  {
    withAvatar: true,
  },
)

const room = useRoom(() => props.room)

const avatarProps = computed(() => (props.manualAvatarSrc ? { src: props.manualAvatarSrc } : { room: room.value }))
</script>

<template>
  <UCard
    :as
    :as-child
    :class="
      cn('w-full relative hover:(border-border-strong bg-hover) h-18 p-3.5 border flex-row gap-3.5 ', $attrs.class)
    "
  >
    <MatrixAvatar v-if="withAvatar" v-bind="avatarProps" square class="rounded-sm shrink-0 w-fit aspect-square" />
    <slot :room />

    <!-- <div class="flex flex-col w-full justify-around tabular-nums">
      <URoomShowcaseCardHeader />

      <div class="flex gap-2 max-h-1em items-center">
        <p v-if="room" class="text-sm font-medium truncate">
          {{ room.name ?? room.roomId }}
        </p>

        <UBadge v-if="suggested" size="sm"> Suggested </UBadge>
      </div>

      <div class="text-xs text-muted-foreground truncate">
        <span class="text-muted-foreground shrink-0"> {{ room.num_joined_members }} members </span>

        <template v-if="room">
          <UInlineSeparator />
          <span>
            {{ room.topic }}
          </span>
        </template>
      </div>
    </div> -->
  </UCard>
</template>
