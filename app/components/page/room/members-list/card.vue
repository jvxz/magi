<script lang="ts" setup>
const props = defineProps<{
  userId: string
}>()

const profile = useUserProfile(props.userId)
const creator = useCurrentRoomCreator()

const triggerRef = useTemplateRef('trigger')
onMounted(() => {
  const btn = unrefElement(triggerRef)
  if (btn) {
    // workaround to prevent virtual list from scrolling when closing popover
    const nativeFocus = btn.focus.bind(btn)
    btn.focus = (options?: FocusOptions) => nativeFocus({ ...options, preventScroll: true })
  }
})
</script>

<template>
  <UProfilePopoverTrigger
    :user="userId"
    :content-props="{ side: 'left', align: 'start', collisionPadding: 12, sideOffset: 8.5 }"
    as-child
  >
    <UButton
      ref="trigger"
      class="text-foreground font-normal gap-2 h-10 w-full justify-start data-[popover-open]:bg-muted/75"
      variant="ghost"
    >
      <MatrixAvatar :user="userId" class="size-6" />
      <p class="shrink-0 truncate">
        {{ profile?.displayname }}
      </p>

      <UTooltipRoot>
        <UTooltipTrigger as-child>
          <Icon
            v-if="userId === creator"
            name="tabler:crown"
            class="text-primary"
          />
        </UTooltipTrigger>
        <UTooltipContent>
          Owner
        </UTooltipContent>
      </UTooltipRoot>
    </UButton>
  </UProfilePopoverTrigger>
</template>
