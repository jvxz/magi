<script lang="ts" setup>
import type { UMenuItemEmits } from '../u/menu-item.vue'

const { id, type, viaServers, eventId } = defineProps<{
  id: string | undefined
  type: MatrixToUrl['type']
  viaServers?: string[] | false
  eventId?: string
}>()
defineEmits<UMenuItemEmits>()

const { copy, isSupported } = useClipboard()
const { client } = useMatrixClient()

const handleCopy = async () => {
  if (!id || !isSupported.value) return
  const matrixTo = getMatrixToUrl(client.value, type, id, {
    eventId,
    viaServers,
  })
  await copy(matrixTo)
}
</script>

<template>
  <UMenuItem :disabled="!isSupported || !id" @select="($emit('select', $event), handleCopy())">
    <Icon :name="ICON__COPY_URL" />
    <span>Copy URL</span>
  </UMenuItem>
</template>
