<script lang="ts" setup>
import type { DialogRootProps } from 'reka-ui'

import type { GlobalDialogMap } from '~/composables/use-global-dialog'

export type DialogTextProps = DialogRootProps & GlobalDialogMap['editAvatar']

const props = withDefaults(defineProps<DialogTextProps>(), { modal: true })

const open = defineModel<boolean>('open')
const { uploadContent, progress } = useUploadContent()
const { isPending: isUploading } = uploadContent

const fs = useFileDialog({ accept: Object.keys(MATRIX__ALLOWED_AVATAR_FILE_TYPES.accept).join(','), multiple: false })
const selectedFile = computed(() => fs.files.value?.[0])
const fileSize = computed(() => selectedFile.value?.size ?? 0)

const objectUrl = useObjectUrl(selectedFile)

const isOpening = ref(false)
const openFileDialog = () => {
  isOpening.value = true
  fs.open()
}

fs.onCancel(() => {
  isOpening.value = false
})

fs.onChange(async () => {
  try {
    if (!selectedFile.value) return

    const { content_uri: mxc } = await uploadContent.mutateAsync({ file: selectedFile.value })

    props.onAction(mxc, selectedFile.value)
    open.value = false
  } catch {
    // reported by useUploadContent's onError
  } finally {
    isOpening.value = false
  }
})

const handleDelete = () => {
  props.onAction(undefined, undefined)
  open.value = false
}

const uploadProgress = computed(() => {
  if (!progress.value) return 0
  return progress.value.loaded / progress.value.total
})

onMounted(() => fs.reset())

const delegated = reactiveOmit(props, ['onAction', 'open'])
</script>

<template>
  <UDialogRoot v-bind="delegated" v-model:open="open">
    <UDialogContent>
      <UDialogHeader>
        <UDialogTitle> Upload avatar </UDialogTitle>
      </UDialogHeader>

      <div class="h-26">
        <div v-if="!isUploading" class="flex gap-4 h-full items-center justify-center *:(flex-1 h-full)">
          <UButton :is-loading="isOpening" class="text-2xl flex-col" @click="openFileDialog">
            <Icon :name="ICON__UPLOAD" class="text-2xl" />
            <span class="text-sm">Upload</span>
          </UButton>

          <UButton :disabled="isOpening" class="text-2xl flex-col" @click="handleDelete">
            <Icon :name="ICON__DELETE" class="text-2xl" />
            <span class="text-sm">Delete</span>
          </UButton>
        </div>

        <div v-else class="flex flex-col gap-4 h-full">
          <div class="flex gap-4 h-full items-center">
            <div class="rounded-sm h-full w-fit aspect-square of-clip">
              <Img :size="128" class="size-full object-cover" :src="objectUrl" :alt="selectedFile?.name" />
            </div>

            <div class="flex flex-col gap-1 h-full">
              <p class="font-medium w-full truncate">{{ selectedFile?.name }}</p>
              <p class="text-sm text-muted-foreground mb-auto tabular-nums">
                {{ formatBytes(uploadProgress * fileSize) }} / {{ formatBytes(fileSize) }}
              </p>
              <UButton variant="danger" class="w-fit" size="sm" @click="uploadContent.abort()"> Cancel </UButton>
            </div>
          </div>

          <div class="flex gap-2 h-1.5 items-center">
            <UProgressBar :progress="uploadProgress" class="shrink-0 h-full" />
            <USpinner />
          </div>
        </div>
      </div>
    </UDialogContent>
  </UDialogRoot>
</template>
