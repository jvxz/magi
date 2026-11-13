<script lang="ts" setup>
import type { DialogRootProps } from 'reka-ui'

import type { GlobalDialogMap } from '~/composables/use-global-dialog'

export type DialogTextProps = DialogRootProps & GlobalDialogMap['editAvatar']

const props = withDefaults(defineProps<DialogTextProps>(), { modal: true })

const open = defineModel<boolean>('open')
const { uploadContent, progress } = useUploadContent()

const { notifyError } = useNotifications()
const fs = useFileSystemAccess({ types: [MATRIX__ALLOWED_AVATAR_FILE_TYPES] })
const { isPending: isUploading } = uploadContent

const objectUrl = useObjectUrl(fs.file)

const isOpening = ref(false)
const openFileDialog = async () => {
  try {
    isOpening.value = true
    await fs.open()

    if (!fs.file.value) return

    const { content_uri: mxc } = await uploadContent.mutateAsync({ file: fs.file.value })

    props.onAction(mxc, fs.file.value)
    open.value = false
  } catch (err) {
    if (!isError(err)) notifyError(new UnexpectedError(), 'Failed to upload file')

    if (!(err instanceof FileTooLargeError) && !(err instanceof DOMException))
      notifyError(err as Error, 'Failed to upload file')
  } finally {
    isOpening.value = false
    fs.file.value = undefined
  }
}

const handleDelete = () => {
  props.onAction(undefined, undefined)
  open.value = false
}

const fileSize = computed(() => fs.file.value?.size ?? 0)
const uploadProgress = computed(() => {
  if (!progress.value) return 0
  return progress.value.loaded / progress.value.total
})

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
              <Img :size="128" class="size-full object-cover" :src="objectUrl" :alt="fs.file.value?.name" />
            </div>

            <div class="flex flex-col gap-1 h-full">
              <p class="font-medium w-full truncate">{{ fs.file.value?.name }}</p>
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
