<script lang="ts" setup>
import { injectLoginPageEditableStateContext } from '~/pages/login/index.vue'

const { editableInput, editableState, error, isPending, refreshHook } = injectLoginPageEditableStateContext()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-0.5 items-end">
      <h1 class="text-3xl font-semibold mr-2 shrink-0 grow">magi</h1>

      <UButton
        v-if="editableState !== 'edit'"
        :disabled="isPending"
        size="icon-sm"
        variant="ghost"
        @click="refreshHook.trigger"
      >
        <Icon name="tabler:refresh" />
      </UButton>

      <UEditableRoot
        v-model:model-value="editableInput"
        v-model:state="editableState"
        default-value="matrix.org"
        placeholder="matrix.org"
        class="shrink min-w-0 -mb-0.75"
      >
        <UEditableArea class="group">
          <UEditablePreview class="shrink min-w-0 hover:decoration-foreground not-hover:decoration-muted-foreground" />
          <UEditableInput />
        </UEditableArea>
      </UEditableRoot>
    </div>

    <div class="group text-sm text-danger flex gap-2 h-1em items-center">
      <USeparator class="flex-1" :class="{ 'bg-danger': !!error }" />

      <template v-if="error">
        <span>{{ error.message }}</span>

        <USeparator class="flex-1" :class="{ 'bg-danger': !!error }" />
      </template>
    </div>
  </div>
</template>
