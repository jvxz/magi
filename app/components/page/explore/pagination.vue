<script lang="ts" setup>
const props = defineProps<{
  baseUrl: string
  isFetchingInitial: boolean
  canPaginateBackward: boolean
  canPaginateForward: boolean
}>()

const { page } = usePublicRoomsState(props.baseUrl)

function handlePaginate(dir: 'f' | 'b') {
  if (dir === 'f') {
    if (props.canPaginateForward)
      page.value += 1

    return
  }

  if (props.canPaginateBackward)
    page.value -= 1
}
</script>

<template>
  <div class="grid grid-cols-3 items-center">
    <div class="mr-auto flex gap-2 items-center justify-center">
      <UButton :disabled="!canPaginateBackward" @click="handlePaginate('b')">
        <Icon name="tabler:arrow-left" />
        <span>Previous</span>
      </UButton>
    </div>

    <div class="text-sm font-medium mx-auto">
      <p v-if="!isFetchingInitial">
        Page {{ page }}
      </p>
      <USkeleton v-else class="h-1lh w-16" />
    </div>

    <div class="ml-auto flex gap-2 items-center justify-center">
      <UButton :disabled="!canPaginateForward" @click="handlePaginate('f')">
        <Icon name="tabler:arrow-right" />
        <span>Next</span>
      </UButton>
    </div>
  </div>
</template>
