<template>
  <div class="flex shrink-0 gap-2 items-center">
    <UserCardActionButton
      button-icon="mingcute:mic-fill"
      button-label="Mute"
      arrow-label="Input Settings"
    />
    <UserCardActionButton
      button-icon="mingcute:headphone-fill"
      button-label="Deafen"
      arrow-label="Output Settings"
    />
    <UTooltipRoot>
      <UTooltipTrigger as-child>
        <UButton variant="ghost" size="icon" class="group/btn">
          <Icon name="mingcute:settings-4-fill" class="size-5 group-hover/btn:rotate-180 duration-0 motion-reduce:duration-0! group-hover/btn:duration-1100 ease" />
        </UButton>
      </UTooltipTrigger>
      <UTooltipContent>
        User Settings
      </UTooltipContent>
    </UTooltipRoot>
  </div>
</template>
