<script lang="ts" setup>
const [DefineToggle, Toggle] = createReusableTemplate<{
  label: string
  value: string
  icon?: string
  avatarUrl?: string
}>()

const { data: directRooms } = useDirectRooms()
</script>

<template>
  <DefineToggle v-slot="{ label, icon, value, avatarUrl }">
    <UToggleGroupItem
      :key="value"
      :value="value"
      class="flex w-full gap-3 items-center h-2.25lh!"
    >
      <LazyIcon
        v-if="icon && !avatarUrl"
        :name="icon"
        class="size-1lh"
      />
      <LazyImg
        v-else-if="avatarUrl"
        :alt="label"
        :src="avatarUrl"
        class="rounded-full size-8"
      />
      <span class="font-medium">{{ label }}</span>
    </UToggleGroupItem>
  </DefineToggle>

  <UToggleGroupRoot class="p-2 flex flex-col gap-2 w-full">
    <Toggle
      label="Recent rooms"
      icon="tabler:door"
      value="recent-rooms"
    />

    <div class="w-full space-y-2">
      <USeparator />

      <div class="group flex items-center justify-between">
        <span class="text-sm text-muted-foreground/80 font-medium px-2.5 group-hover:text-foreground">Direct Messages</span>
        <UTooltipRoot>
          <UTooltipTrigger as-child>
            <button class="text-muted-foreground/80 cursor-pointer">
              <Icon name="tabler:plus" />
            </button>
          </UTooltipTrigger>
          <UTooltipContent>
            Create Message
          </UTooltipContent>
        </UTooltipRoot>
      </div>
    </div>

    <div class="flex flex-col gap-1 w-full">
      <Toggle
        v-for="directRoom in directRooms"
        :key="directRoom.roomId"
        :label="directRoom.name"
        :value="directRoom.roomId"
        :avatar-url="directRoom.avatarUrl"
      />
    </div>
  </UToggleGroupRoot>
</template>
