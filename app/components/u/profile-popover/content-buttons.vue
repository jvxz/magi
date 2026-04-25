<script lang="ts" setup>
const props = defineProps<{ userId: string | undefined }>()

const { self } = useSelf()

const { copy, isSupported } = useClipboard()
const copied = refAutoReset(false, 750)

function handleCopyUserId() {
  if (!isSupported.value || !props.userId)
    return

  copy(props.userId).then(() => copied.value = true)
}
</script>

<template>
  <div class="p-2 space-x-1">
    <UButton
      v-if="userId !== self?.userId"
      size="icon"
      variant="soft"
      class="rounded-full"
    >
      <Icon name="tabler:message" />
    </UButton>
    <UDropdownMenuRoot>
      <UDropdownMenuTrigger as-child>
        <UButton
          size="icon"
          variant="soft"
          class="rounded-full"
        >
          <Icon name="tabler:dots" />
        </UButton>
      </UDropdownMenuTrigger>
      <UDropdownMenuContent>
        <UDropdownMenuItem
          :disabled="!isSupported || !props.userId"
          @click="handleCopyUserId"
        >
          <Icon name="tabler:tag" /> Copy ID
        </UDropdownMenuItem>
      </UDropdownMenuContent>
    </UDropdownMenuRoot>
  </div>
</template>
