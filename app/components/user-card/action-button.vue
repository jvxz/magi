<script lang="ts" setup>
defineProps<{
  buttonIcon: string
  buttonLabel: string
  arrowLabel: string
}>()

defineEmits<{
  buttonClick: []
  arrowClick: []
}>()
</script>

<template>
  <div class="flex gap-px w-fit items-center">
    <UTooltipRoot>
      <UTooltipTrigger as-child>
        <UButton
          size="icon"
          variant="ghost"
          class="text-danger rounded-r-none bg-danger/10 transition-colors duration-150 ease active:text-danger hover:text-danger active:bg-danger/20 hover:bg-danger/20"
          @click="$emit('buttonClick')"
        >
          <Icon :name="buttonIcon" class="size-5" />
        </UButton>
        <UTooltipContent>
          {{ buttonLabel }}
        </UTooltipContent>
      </UTooltipTrigger>
    </UTooltipRoot>
    <UTooltipRoot>
      <UTooltipTrigger as-child>
        <UButton
          size="icon"
          variant="ghost"
          class="text-danger rounded-l-none bg-danger/10 w-3.5 transition-colors duration-150 ease active:text-danger hover:text-danger active:bg-danger/20 hover:bg-danger/20"
          @click="$emit('arrowClick')"
        >
          <Icon name="tabler:chevron-down" class="size-5" />
        </UButton>
        <UTooltipContent>
          {{ arrowLabel }}
        </UTooltipContent>
      </UTooltipTrigger>
    </UTooltipRoot>
  </div>
</template>
