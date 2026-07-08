<script lang="ts" setup>
const { client } = useMatrixClient()

const open = ref(false)
const beganResync = ref(false)
const { executeImmediate: resync } = useAsyncState(
  async () => {
    beganResync.value = true

    await resetClientData(client.value)
    reloadNuxtApp()
  },
  undefined,
  { immediate: false },
)
</script>

<template>
  <SettingsContentLayout>
    <SettingsFormPrimitive
      :label="SETTINGS_ITEM_METADATA.advanced.resync.title"
      :description="SETTINGS_ITEM_METADATA.advanced.resync.description"
    >
      <UAlertDialogRoot
        :open
        @update:open="
          e => {
            if (beganResync) return
            open = e
          }
        "
      >
        <UAlertDialogContent>
          <UAlertDialogHeader>
            <UAlertDialogTitle> {{ SETTINGS_ITEM_METADATA.advanced.resync.title }} </UAlertDialogTitle>
            <UAlertDescription>
              Re-syncing Magi does not log you out or invalidate your recovery key. Continuing will refresh the page
              when finished.
            </UAlertDescription>
          </UAlertDialogHeader>

          <UAlertDialogFooter>
            <UAlertDialogCancel :disabled="beganResync"> Cancel </UAlertDialogCancel>

            <UButton variant="danger" :is-loading="beganResync" @click="resync">
              <span>Continue</span>
            </UButton>
          </UAlertDialogFooter>
        </UAlertDialogContent>

        <UAlertDialogTrigger variant="default" as-child>
          <UButton variant="danger">
            {{ SETTINGS_ITEM_METADATA.advanced.resync.title }}
          </UButton>
        </UAlertDialogTrigger>
      </UAlertDialogRoot>
    </SettingsFormPrimitive>
  </SettingsContentLayout>
</template>
