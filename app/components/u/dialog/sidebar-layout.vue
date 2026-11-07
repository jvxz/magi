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
    <div class="p-2 border-r bg-background flex shrink-0 flex-col gap-1 h-full w-25% group-data-[size=lg]/dialog:p-4">
      <slot name="sidebar" />
    </div>

    <div class="flex flex-col size-full">
      <UDialogHeader
        :class="
          cn(
            'w-full flex justify-center mb-0',
            'group-data-[size=md]/dialog:h-12 group-data-[size=md]/dialog:pl-4',
            'group-data-[size=lg]/dialog:h-15 group-data-[size=lg]/dialog:pl-5',
          )
        "
        :ui="{
          closeButton: cn(
            'group-data-[size=lg]/dialog:right-4 group-data-[size=lg]/dialog:top-4',
            'group-data-[size=md]/dialog:right-2 group-data-[size=md]/dialog:top-2',
          ),
        }"
      >
        <UDialogTitle>{{ title }}</UDialogTitle>
      </UDialogHeader>

      <UScrollAreaRoot>
        <UScrollAreaViewport class="p-2 px-4">
          <slot />
        </UScrollAreaViewport>

        <UScrollAreaScrollbar orientation="vertical">
          <UScrollAreaThumb />
        </UScrollAreaScrollbar>
      </UScrollAreaRoot>
    </div>
  </div>
</template>
