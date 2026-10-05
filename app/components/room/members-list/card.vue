<script lang="ts" setup>
const props = defineProps<{
  userId: string
}>()

const profile = useUserProfile(props.userId)
const creator = useCurrentRoomCreator()
const room = useCurrentRoom()

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
    freeze-reference
    :user="userId"
    :content-props="{
      side: 'left',
      align: 'start',
      collisionPadding: 12,
      sideOffset: 10,
      disableUpdateOnLayoutShift: true,
    }"
    as-child
  >
    <UButton
      ref="trigger"
      class="text-foreground font-normal mb-px gap-2 h-10 w-full justify-start data-[popover-open]:bg-selected!"
      variant="ghost"
    >
      <div class="shrink-0 size-6 [&>svg]:size-full!">
        <MatrixRoomMemberAvatar :room :member="userId" class="size-full" />
      </div>

      <p :title="profile?.displayname" class="truncate">
        {{ profile?.displayname }}
      </p>

      <UTooltipRoot>
        <UTooltipTrigger as-child>
          <Icon v-if="userId === creator" :name="ICON__CREATOR" class="text-primary" />
        </UTooltipTrigger>
        <UTooltipContent> Owner </UTooltipContent>
      </UTooltipRoot>
    </UButton>
  </UProfilePopoverTrigger>
</template>
