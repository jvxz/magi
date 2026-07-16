<script lang="ts" setup>
import { injectLoginPageEditableStateContext } from '~/pages/login/new.vue'

const { editableInput, editableState, isPending, refreshHook, error } = injectLoginPageEditableStateContext()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-end gap-0.5">
      <h1 class="text-3xl font-semibold grow shrink-0 mr-2">magi</h1>

      <UButton
        v-if="editableState !== 'edit'"
        @click="refreshHook.trigger"
        :disabled="isPending"
        size="icon-sm"
        variant="ghost"
      >
        <Icon name="tabler:refresh" />
      </UButton>

      <UEditableRoot
        v-model:model-value="editableInput"
        v-model:state="editableState"
        default-value="matrix.org"
        placeholder="matrix.org"
        class="-mb-0.75 min-w-0 shrink"
      >
        <UEditableArea class="group">
          <UEditablePreview class="shrink min-w-0 not-hover:decoration-muted-foreground hover:decoration-foreground" />
          <UEditableInput />
        </UEditableArea>
      </UEditableRoot>
    </div>

    <div class="group flex gap-2 items-center text-danger h-1em text-sm">
      <USeparator class="flex-1" :class="{ 'bg-danger': !!error }" />

      <template v-if="error">
        <span>{{ error.message }}</span>

        <USeparator class="flex-1" :class="{ 'bg-danger': !!error }" />
      </template>
    </div>
  </div>
</template>
