<script lang="ts" setup>
import type { RoomSummary } from 'matrix-js-sdk'

import { JoinRule } from 'matrix-js-sdk'

const { summary, roomId } = defineProps<{ roomId: string; summary: RoomSummary | null | undefined }>()

const name = computed(() => summary?.name ?? roomId)
const avatarSrc = useResolveAvatarUrl(() => summary?.avatar_url)
</script>

<template>
  <div class="flex items-center justify-center size-full">
    <div class="w-full max-w-md flex flex-col gap-4">
      <Img v-if="avatarSrc" :alt="name" :src="avatarSrc" square class="rounded size-16" />
      <div v-else class="size-16 rounded border border-border border-dashed" />

      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-semibold">
            {{ name }}
          </h1>

          <UTooltipRoot v-if="summary?.join_rule">
            <UTooltipTrigger as-child>
              <Icon :name="summary.join_rule === JoinRule.Public ? 'tabler:world' : 'tabler:lock'" />
            </UTooltipTrigger>

            <UTooltipContent> This room is {{ resolveJoinRuleLabel(summary.join_rule) }} </UTooltipContent>
          </UTooltipRoot>
        </div>

        <p v-if="summary" class="text-muted-foreground text-sm">{{ roomId }}</p>
      </div>

      <p
        v-if="summary"
        class="text-muted-foreground text-sm"
        :class="{
          italic: !summary?.topic,
        }"
      >
        {{ summary?.topic ?? '(no description)' }}
      </p>

      <div v-if="summary" class="flex flex-col gap-1">
        <p class="text-sm flex items-center gap-1">
          <Icon name="tabler:users" />
          <span class="tabular-nums">
            {{ $n(summary.num_joined_members) }}
            {{ handlePlural(summary.num_joined_members, 'members', 'member') }}
          </span>
        </p>
      </div>

      <div class="flex gap-1">
        <UButton> Join room </UButton>
        <UButton v-if="summary" :disabled="!summary.world_readable" variant="outline"> Peek in room </UButton>
      </div>
    </div>
  </div>
</template>
