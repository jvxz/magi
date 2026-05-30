<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const props = defineProps<{
  space: Room | undefined
  isLoading: boolean
  description?: string
}>()

const topic = useRoomTopic(() => props.space)
const joinedMemberCount = useRoomMemberCount(() => props.space)
const creationTs = useRoomCreationTs(() => props.space)
const founder = useRoomFounder(() => props.space)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-3 items-center *:text-clip">
      <MatrixAvatar v-if="space" :room="space" class="rounded shrink-0 size-10" />
      <USkeleton v-else class="rounded shrink-0 size-10" />

      <h1 v-if="space" class="text-3xl font-semibold">
        {{ space?.name }}
      </h1>
      <USkeleton v-else class="text-3xl h-1em w-48" />

      <USpinner v-if="isLoading" class="size-6" />
    </div>

    <p v-if="topic" class="text-muted-foreground">
      {{ topic }}
    </p>

    <div class="text-sm flex gap-2 items-center tabular-nums *:flex *:gap-1 *:items-center">
      <div>
        <Icon name="tabler:users" />

        <span v-if="isDefined(joinedMemberCount)">{{ joinedMemberCount }}</span>
        <USkeleton v-else class="h-1em w-4" />

        <span>members</span>
      </div>

      <UInlineSeparator />

      <UTooltipRoot :disabled="isNil(creationTs)">
        <UTooltipTrigger as-child>
          <span>
            <Icon name="tabler:calendar" />
            <span>Founded</span>

            <NuxtTime v-if="isDefined(creationTs)" :datetime="creationTs" />
            <USkeleton v-else class="h-1em w-16" />
          </span>
        </UTooltipTrigger>

        <UTooltipContent v-if="isDefined(creationTs)">
          <NuxtTime :datetime="creationTs" v-bind="PROPS__NUXT_TIME_FULL" />
        </UTooltipContent>
      </UTooltipRoot>

      <UInlineSeparator />

      <UProfilePopoverTrigger
        v-if="founder"
        as-child
        :manual-room="space"
        :user="founder.userId"
        :content-props="{
          side: 'bottom',
          sideOffset: 12,
        }"
      >
        <UButton
          variant="link"
          class="font-normal no-underline flex gap-2 items-center data-[state=open]:underline hover:underline h-1em!"
        >
          <MatrixAvatar :user="founder" class="size-4" />
          <span>{{ resolveUserName(founder) }}</span>
        </UButton>
      </UProfilePopoverTrigger>

      <div v-else class="flex gap-2 items-center">
        <USkeleton class="size-4" />
        <USkeleton class="h-1em w-16" />
      </div>
    </div>
  </div>
</template>
