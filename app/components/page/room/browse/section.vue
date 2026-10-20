<script lang="ts" setup>
const props = defineProps<{
  defaultOpen?: boolean
  title: string
  roomCount?: number
  memberCount?: number
  description?: string
  avatar?: string
  avatarPlaceholder?: boolean
}>()

const openModel = defineModel<boolean>('open', { default: false })
if (props.defaultOpen) openModel.value = props.defaultOpen

const resolvedAvatar = useResolveAvatarUrl(() => props.avatar)
</script>

<template>
  <UCollapsibleRoot v-model:open="openModel" :default-open>
    <UCollapsibleTrigger :class="title !== 'Rooms' && 'h-12'" variant="room">
      <UCollapsibleTriggerIcon />

      <MatrixAvatar
        v-if="isDefined(avatar) || avatarPlaceholder"
        :src="resolvedAvatar"
        :alt="title"
        square
        class="rounded-sm shrink-0 h-full w-fit aspect-square object-contain"
      />

      <div class="flex flex-col gap-2 h-full items-start justify-center">
        <p class="text-clip">
          {{ title }}
        </p>
        <div
          v-if="isDefined(roomCount) || isDefined(memberCount) || description"
          class="text-xs text-muted-foreground font-normal flex gap-1 w-full items-center *:text-clip"
        >
          <span v-if="isDefined(roomCount)" class="shrink-0"> {{ roomCount }} rooms </span>

          <template v-if="isDefined(memberCount)">
            <UInlineSeparatorRoot />
            <span class="shrink-0"> {{ memberCount }} members </span>
          </template>

          <template v-if="description">
            <UInlineSeparatorRoot />
            <span class="truncate">
              {{ description }}
            </span>
          </template>
        </div>
      </div>
    </UCollapsibleTrigger>

    <UCollapsibleContent bar>
      <UCollapsibleContentBar />

      <UCardGroupRoot variant="raised" class="flex flex-col gap-2 w-full">
        <slot :open="openModel" />
      </UCardGroupRoot>
    </UCollapsibleContent>
  </UCollapsibleRoot>
</template>
