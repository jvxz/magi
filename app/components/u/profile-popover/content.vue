<script lang="ts" setup>
const { anchorElement, contentProps, open, user } = useProfilePopover()

const profile = useUserProfile(() => user.value?.userId)
const { self } = useSelf()

const currentRoom = useCurrentRoom()

const displayName = computed(() => profile.value?.displayname ?? getDisplayNameFallback(user.value?.userId))
const avatarUrl = computed(() => resolveAvatarUrl(user.value?.avatarUrl, { size: 'small' }))
const parsedUserId = computed(() => parseUserId(user.value?.userId))

const powerLevel = useUserRoomPowerLevel(() => currentRoom.value?.roomId, () => user.value?.userId)
const powerLevelName = computed(() => upperFirst(isNull(powerLevel.value) ? 'member' : getPowerLevelName(powerLevel.value)))

const isSelf = computed(() => self.value?.userId === user.value?.userId)

const { copy } = useClipboard()
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
              <p class="text-xs underline-offset-4">
                {{ `@${parsedUserId.name}` }}
              </p>

              <UDropdownMenuRoot>
                <UDropdownMenuTrigger as-child>
                  <UButton class="text-xs text-muted-foreground font-normal p-0 rounded-none border-none bg-transparent h-fit hover:text-muted-foreground active:border-none hover:border-none active:bg-transparent hover:bg-transparent hover:underline">
                    {{ `:${parsedUserId.homeserver}` }}
                  </UButton>
                </UDropdownMenuTrigger>
                <UDropdownMenuContent side="right" align="start">
                  <UDropdownMenuItem as-child>
                    <NuxtLink
                      :to="{
                        name: 'explore',
                        params: { baseUrl: parsedUserId.homeserver },
                      }"
                      @click="open = false"
                    >
                      Explore rooms
                    </NuxtLink>
                  </UDropdownMenuItem>
                  <UDropdownMenuItem @click="copy(parsedUserId.homeserver)">
                    Copy URL
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
