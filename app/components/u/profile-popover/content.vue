<script lang="ts" setup>
const { anchorElement, contentProps, user } = useProfilePopover()

const profile = useUserProfile(() => user.value?.userId)
const { self } = useSelf()

const currentRoom = useCurrentRoom()

const displayName = computed(() => profile.value?.displayname ?? getDisplayNameFallback(user.value?.userId))
const avatarUrl = computed(() => resolveAvatarUrl(user.value?.avatarUrl, { size: 'small' }))
const parsedUserId = computed(() => parseUserId(user.value?.userId))

const powerLevel = useUserRoomPowerLevel(() => currentRoom.value?.roomId, () => user.value?.userId)
const powerLevelName = computed(() => upperFirst(isNull(powerLevel.value) ? 'member' : getPowerLevelName(powerLevel.value)))

const isSelf = computed(() => self.value?.userId === user.value?.userId)

const { copy, isSupported } = useClipboard()
const copied = refAutoReset(false, 750)

function handleCopyUserId() {
  if (!isSupported.value || !user.value?.userId)
    return

  copy(user.value.userId).then(() => copied.value = true)
}
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="contentProps"
      as-child
      disable-outside-pointer-events
      :reference="anchorElement ?? undefined"
      :class="cn('z-1', $attrs.class)"
    >
      <UCard class="p-0 border-none bg-card-light gap-0 w-74 transition-transform duration-100 relative overflow-clip animate-in animate-ease-out data-[state=open]:slide-in-from-r-3">
        <div class="shrink-0 h-24 inset-0 absolute overflow-clip">
          <div class="flex h-full justify-end relative">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="`${displayName}'s avatar (banner)'`"
              class="size-full scale-150 absolute object-cover blur-xl -z-1"
            />

            <div v-else class="bg-muted size-full absolute -z-1" />

            <UProfilePopoverContentButtons :user-id="user?.userId" />
          </div>
        </div>

        <div class="px-4 pb-4 pt-14 border border-border rounded-b flex flex-1 flex-col gap-2">
          <MatrixAvatar
            :user="user"
            class="size-20 ring-6 ring-card-light"
            image-size="small"
          />

          <div class="flex flex-col">
            <p class="text-lg font-medium">
              {{ displayName }}
            </p>

            <div class="flex items-center">
              <UTooltipRoot disable-closing-trigger @update:open="() => copied = false">
                <UTooltipTrigger as-child :disabled="!isSupported">
                  <button class="peer text-xs underline-offset-4 cursor-pointer hover:underline" @click="handleCopyUserId">
                    {{ `@${parsedUserId.name}` }}
                  </button>
                </UTooltipTrigger>
                <UTooltipContent
                  side="left"
                  class="group grid place-items-center"
                  style="grid-template-areas: stack;"
                  :data-copied="copied"
                >
                  <span
                    style="grid-area: stack;"
                    class="duration-100 group-data-[copied=false]:(opacity-100 scale-100) group-data-[copied=true]:(opacity-0 scale-92.5)"
                  >
                    Copy
                  </span>
                  <div
                    style="grid-area: stack;"
                    class="pointer-events-none duration-100 group-data-[copied=false]:(opacity-0 scale-92.5) group-data-[copied=true]:(opacity-100 scale-100)"
                  >
                    <Icon mode="svg" name="tabler:check" />
                  </div>
                </UTooltipContent>
              </UTooltipRoot>

              <UDropdownMenuRoot>
                <UDropdownMenuTrigger as-child>
                  <UButton class="text-xs text-muted-foreground font-normal p-0 rounded-none border-none bg-transparent h-fit hover:text-muted-foreground peer-hover:text-foreground active:border-none hover:border-none active:bg-transparent hover:bg-transparent hover:underline peer-hover:underline">
                    {{ `:${parsedUserId.homeserver}` }}
                  </UButton>
                </UDropdownMenuTrigger>
                <UDropdownMenuContent side="right" align="start">
                  <UDropdownMenuItem>
                    Explore rooms
                  </UDropdownMenuItem>
                </UDropdownMenuContent>
              </UDropdownMenuRoot>
            </div>
          </div>

          <UProfilePopoverMutualRooms v-if="!isSelf" />

          <div class="flex flex-wrap gap-1 *:text-xs *:font-normal *:rounded-full *:max-w-28 *:block *:truncate">
            <UBadge class="" variant="outline">
              {{ powerLevelName }}
            </UBadge>
          </div>

          <UInput
            v-if="!isSelf"
            :placeholder="`Message ${displayName}`"
            class="text-xs"
          />
        </div>
      </UCard>
    </PopoverContent>
  </PopoverPortal>
</template>
