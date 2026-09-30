<script lang="ts" setup>
import { required } from '@regle/rules'

import { injectSettingsContentDevicesContext } from '../devices.vue'

const { renameDialogOpen, deviceRenaming, renameMutation: renameDevice } = injectSettingsContentDevicesContext()

const { devices, refetch: refetchDevices } = useDevices()
const device = computed(() => (deviceRenaming.value ? devices.value.get(deviceRenaming.value) : undefined))

const { error: renameError } = renameDevice

const { r$ } = useRegle(
  {
    name: '',
  },
  {
    name: {
      required,
    },
  },
)

const dialogOpen = computed({
  get: () => renameDialogOpen.value,
  set: open => {
    if (renameDevice.isPending.value) return
    renameDialogOpen.value = open
  },
})

watch(renameDialogOpen, open => {
  if (!open) {
    deviceRenaming.value = undefined
  } else {
    renameDevice.reset()
    r$.name.$value = device.value?.display_name ?? ''
  }
})

watch(device, d => {
  if (!d) renameDialogOpen.value = false
})

const { executeImmediate: handleRename, isLoading: isRenamingDevice } = useAsyncState(
  async () => {
    if (!device.value || !r$.$value.name.trim() || isRenamingDevice.value) return

    try {
      await renameDevice.mutateAsync({ deviceId: device.value.device_id, name: r$.$value.name })
      await refetchDevices()
      renameDialogOpen.value = false
    } catch {}
  },
  undefined,
  { immediate: false },
)
</script>

<template>
  <UDialogRoot v-model:open="dialogOpen">
    <UDialogContent v-if="device" as-child>
      <Form @submit="handleRename">
        <UDialogHeader>
          <UDialogTitle> Rename "{{ resolveDeviceName(device) }}" </UDialogTitle>
        </UDialogHeader>

        <FormInput v-model:model-value="r$.$value.name" data-autofocus label="Device name" :error="r$.$errors.name" />

        <UDialogFooter>
          <UDialogAnnotation>
            {{ renameError }}
          </UDialogAnnotation>

          <UDialogClose :disabled="isRenamingDevice" variant="ghost"> Cancel </UDialogClose>
          <UButton :is-loading="isRenamingDevice" type="submit">
            <span>Rename</span>
          </UButton>
        </UDialogFooter>
      </Form>
    </UDialogContent>
  </UDialogRoot>
</template>
