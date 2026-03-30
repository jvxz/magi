<script lang="ts" setup>
const { open } = useSettingsDialog()
</script>

<template>
  <UDialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="cn(overlayStyles)" />
      <DialogContent
        data-slot="dialog-content"
        :class="
          cn(
            staticStyles.base,
            staticStyles.variant.default,
            'fixed top-[50%] left-[50%] z-50 grid w-full h-full rounded-none border-0 md:border md:rounded md:h-[90%] md:w-[87rem] md:max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out data-[state=open]:zoom-in-95 p-0',
          )"
        @close-auto-focus.prevent
      >
        <div class="flex">
          <LazySettingsDialogSidebar />
          <header class="pe-2.5 ps-4 border-b flex flex-1 h-header-height items-center">
            <DialogTitle class="font-medium">
              My Account
            </DialogTitle>
            <div class="flex-1" />
            <DialogClose
              :class="cn(
                interactiveStyles.base,
                interactiveStyles.variant.ghost,
                interactiveStyles.size.icon,
                'inline-flex size-8 items-center justify-center opacity-70',
              )"
            >
              <Icon name="tabler:x" class="size-5" />
              <span class="sr-only">Close</span>
            </DialogClose>
          </header>
        </div>
      </DialogContent>
    </DialogPortal>
  </UDialogRoot>
</template>
