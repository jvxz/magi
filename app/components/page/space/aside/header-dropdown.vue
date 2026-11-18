<script lang="ts" setup>
import { injectSpacePageContext } from '~/pages/app/space/[spaceId].vue'

const { spaceId } = injectSpacePageContext()
</script>

<template>
  <UDropdownMenuRoot>
    <UDropdownMenuTrigger as-child>
      <UButton variant="ghost" size="icon">
        <Icon :name="ICON__MORE" />
      </UButton>
    </UDropdownMenuTrigger>

    <UDropdownMenuContent align="end">
      <MenuItemSetRoom :room-id="spaceId" />
    </UDropdownMenuContent>
  </UDropdownMenuRoot>
</template>
