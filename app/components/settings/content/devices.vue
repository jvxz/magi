<script lang="ts">
import { createContext } from 'reka-ui'

export interface SettingsContentDevicesContext {
  deleteDevice: (deviceId: string) => void
  isDeletingAnyDevice: Ref<boolean>
  deviceDeleting: Ref<string | undefined>
  now: Readonly<Ref<Date>>
}

export const [injectSettingsContentDevicesContext, provideSettingsContentDevicesContext] =
  createContext<SettingsContentDevicesContext>('SettingsContentDevices')
</script>

<script lang="ts" setup>
const { devices, error, isFetching, refetch } = useDevices()

const currentDevice = useCurrentDevice()

const cachedCount = useCachedCount('devices', () => (devices.value ? devices.value.size || undefined : undefined), 4)

const { sortState } = useSortRegion('deviceList')
const sortedDevices = computed(() => {
  const { option, dir } = sortState.value
  const sign = dir === 'asc' ? 1 : -1

  return [...devices.value.values()].toSorted((a, b) => {
    switch (option) {
      case 'last-active':
        return sign * ((a.last_seen_ts ?? 0) - (b.last_seen_ts ?? 0))
      case 'verified':
        return sign * (Number(!!a.crypto?.verified) - Number(!!b.crypto?.verified))
      default:
        return sign * resolveDeviceName(a).localeCompare(resolveDeviceName(b))
    }
  })
})

const clientActions = useClientActions()
const deviceDeleting = ref<string>()
async function deleteDevice(deviceId: string) {
  try {
    deviceDeleting.value = deviceId
    await clientActions.deleteDevice.mutateAsync({ deviceId })
  } finally {
    deviceDeleting.value = undefined
  }
}

const now = useNow({ interval: 30_000 })

provideSettingsContentDevicesContext({
  deleteDevice,
  deviceDeleting,
  isDeletingAnyDevice: clientActions.deleteDevice.isPending,
  now,
})
</script>

<template>
  <UScrollAreaRoot>
    <UScrollAreaViewport>
      <UTooltipRegionRoot name="deviceListVerifiedIcon">
        <SettingsContentLayout class="flex flex-col h-full">
          <SettingsItemPrimitive class="gap-2 w-full">
            <template #label>
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center gap-1">
                  <p class="font-medium">Device list</p>

                  <USpinner v-if="isFetching" class="size-1em" />
                </div>

                <div class="flex items-center gap-1">
                  <UButton @click="refetch" size="icon-sm" variant="ghost">
                    <Icon name="tabler:reload" />
                  </UButton>

                  <USortSelect
                    v-model:model-value="sortState"
                    :disabled="!!error"
                    :default-value="{ dir: 'asc', option: 'last-active' }"
                    :options="['last-active', 'name', 'verified']"
                    size="sm"
                  />
                </div>
              </div>
            </template>

            <UCardGroupRoot v-if="!error" variant="raised" class="w-full">
              <template v-if="devices.size">
                <template v-for="(device, i) in sortedDevices" :key="device.device_id">
                  <UCardGroupSeparator v-if="i" />
                  <SettingsContentDevicesCard :is-current="device.device_id === currentDevice?.device_id" :device />
                </template>
              </template>

              <template v-else>
                <USkeleton v-for="key in cachedCount" :key class="h-17.5 w-full" />
              </template>
            </UCardGroupRoot>

            <UAlertRoot v-else variant="danger">
              <UAlertIcon name="tabler:exclamation-circle" />
              <UAlertContent>
                <UAlertTitle>
                  {{ error.name }}
                </UAlertTitle>
                <UAlertDescription>
                  {{ error.message }}
                </UAlertDescription>
              </UAlertContent>
            </UAlertRoot>
          </SettingsItemPrimitive>
        </SettingsContentLayout>

        <UTooltipRegionContent v-slot="{ payload }" name="deviceListVerifiedIcon">
          {{ payload?.verified ? 'Verified' : 'Unverified' }}
        </UTooltipRegionContent>
      </UTooltipRegionRoot>
    </UScrollAreaViewport>

    <UScrollAreaScrollbars />
  </UScrollAreaRoot>
</template>
