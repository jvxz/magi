<script lang="ts" setup>
export interface UProfilePopoverContentButtonsProps {
  userId: string | undefined
}

const props = defineProps<UProfilePopoverContentButtonsProps>()

const { context, open } = useProfilePopover()

const { self } = useSelf()

const user = useUser(() => props.userId)
</script>

<template>
  <div class="p-2 space-x-1">
    <UButton
      v-if="context?.from !== 'direct' && userId !== self?.userId"
      size="icon"
      variant="soft"
      class="rounded-full border-none"
    >
      <Icon :name="ICON__MESSAGE" />
    </UButton>
    <UDropdownMenuRoot :modal="false">
      <UDropdownMenuTrigger as-child>
        <UButton size="icon" variant="soft" class="rounded-full border-none bg-popover">
          <Icon :name="ICON__MORE" />
        </UButton>
      </UDropdownMenuTrigger>
      <UDropdownMenuContent>
        <MenuItemCopyId :id="userId" />
        <MenuItemViewAvatar
          @select="open = false"
          :payload="userId ? { label: resolveUserName(user ?? props.userId), type: 'user', user: userId } : undefined"
        />
      </UDropdownMenuContent>
    </UDropdownMenuRoot>
  </div>
</template>
