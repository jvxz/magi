<script lang="ts">
export const INJECTION_KEY__DIALOG_SIDEBAR_LAYOUT_TITLE: InjectionKey<Ref<AcceptableValue>> =
  Symbol('dialog-sidebar-layout-title')
</script>

<script lang="ts" setup>
import type { AcceptableValue } from 'reka-ui'

const props = defineProps<{ getTitle?: (key: string) => AcceptableValue }>()

const titleRef = ref('')
provide(INJECTION_KEY__DIALOG_SIDEBAR_LAYOUT_TITLE, titleRef)

const title = computed(() => (props.getTitle ? props.getTitle(titleRef.value) : titleRef.value))
</script>

<template>
  <div class="flex size-full">
    <div class="h-full w-25% border-r p-2 group-data-[size=lg]/dialog:p-4 shrink-0 bg-background flex flex-col gap-1">
      <slot name="sidebar" />
    </div>

    <div class="size-full">
      <UDialogHeader
        :class="
          cn(
            'w-full flex justify-center mb-0',
            'group-data-[size=md]/dialog:h-12 group-data-[size=md]/dialog:pl-4',
            'group-data-[size=lg]/dialog:h-15 group-data-[size=lg]/dialog:pl-5',
          )
        "
        :ui="{ closeButton: 'group-data-[size=lg]/dialog:right-4 group-data-[size=lg]/dialog:top-4' }"
      >
        <UDialogTitle>{{ title }}</UDialogTitle>
      </UDialogHeader>

      <UScrollAreaRoot>
        <UScrollAreaViewport class="p-2">
          <slot />
        </UScrollAreaViewport>

        <UScrollAreaScrollbars />
      </UScrollAreaRoot>
    </div>
  </div>
</template>
