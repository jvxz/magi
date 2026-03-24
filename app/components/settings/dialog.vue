<script lang="ts" setup>
const { open } = useSettingsDialog()
</script>

<template>
  <UDialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay
        :class="cn(overlayStyles)"
      />
      <DialogContent
        data-slot="dialog-content"
        :class="
          cn(
            staticStyles.base,
            staticStyles.variant.default,
            'fixed top-[50%] left-[50%] z-50 grid w-full h-full rounded-none border-0 md:border md:rounded md:h-[90%] md:w-[87rem] md:max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out data-[state=open]:zoom-in-95',
          )"
      >
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla dolore voluptatum iure possimus, voluptate ad expedita debitis perferendis asperiores. Incidunt.
        <DialogClose
          :class="cn(
            interactiveStyles.base,
            interactiveStyles.variant.ghost,
            interactiveStyles.size.icon,
            'absolute top-3 right-3 inline-flex size-6 items-center justify-center opacity-70',
          )"
        >
          <Icon name="mingcute:close-line" class="size-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </UDialogRoot>
</template>
