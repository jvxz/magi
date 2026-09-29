<script lang="ts" setup>
import { required } from '@regle/rules'

import { injectSettingsContentDevicesContext } from '../devices.vue'

const { renameDialogOpen, deviceRenaming, renameMutation: renameDevice } = injectSettingsContentDevicesContext()

const { devices, refetch: refetchDevices } = useDevices()
const device = computed(() => (deviceRenaming.value ? devices.value.get(deviceRenaming.value) : undefined))

const { isPending: isRenamingDevice, error: renameError } = renameDevice

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

async function handleRename() {
  if (!device.value || !r$.$value.name.trim()) return

  try {
    await renameDevice.mutateAsync({ deviceId: device.value.device_id, name: r$.$value.name })
    await refetchDevices()
    renameDialogOpen.value = false
  } catch {}
}
</script>

<template>
  <UAlertDialogRoot v-model:open="dialogOpen">
    <UAlertDialogContent v-if="device" as-child>
      <Form @submit="handleRename">
        <UAlertDialogHeader>
          <UAlertDialogTitle> Rename "{{ resolveDeviceName(device) }}" </UAlertDialogTitle>
        </UAlertDialogHeader>

        <FormInput v-model:model-value="r$.$value.name" autofocus label="Device name" :error="r$.$errors.name" />

        <UAlertDialogFooter>
          <UAlertDialogAnnotation>
            {{ renameError }}
          </UAlertDialogAnnotation>

          <UAlertDialogCancel :disabled="renameDevice.isPending.value" variant="ghost"> Cancel </UAlertDialogCancel>
          <UButton :is-loading="isRenamingDevice" type="submit">
            <span>Rename</span>
          </UButton>
        </UAlertDialogFooter>
      </Form>
    </UAlertDialogContent>
  </UAlertDialogRoot>
</template>
