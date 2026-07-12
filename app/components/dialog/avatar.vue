<script lang="ts" setup>
import type { DialogRootProps } from 'reka-ui'

export type AvatarDialogProps = DialogRootProps & GlobalDialogMap['avatar']

const props = withDefaults(defineProps<AvatarDialogProps>(), { modal: true })

const open = defineModel<boolean>('open')

const delegated = reactiveOmit(props, ['room', 'open'])
const isError = ref(false)

const imageUrl = ref<string>()
const saveAvatarImage = () => {
  if (!imageUrl.value) return
  const resolvedId = props.user ? resolveUserId(props.user) : props.room ? resolveRoomId(props.room) : undefined
  const filename = resolvedId ? `${resolvedId}-avatar` : createGenericFilename()

  saveAsImage(imageUrl.value, filename)
}
</script>

<template>
  <UDialogRoot v-bind="delegated" v-model:open="open">
    <UDialogContent>
      <UDialogHeader>
        <UDialogTitle> {{ label }} </UDialogTitle>
        <VisuallyHidden>
          <UDialogDescription> {{ label }}'s avatar </UDialogDescription>
        </VisuallyHidden>
      </UDialogHeader>

      <MatrixAvatar :room :src :user square class="rounded w-full" image-size="full" @url="imageUrl = $event" />

      <UDialogFooter>
        <UDialogAnnotation v-if="isError" class="text-danger"> Failed to load avatar </UDialogAnnotation>
        <div class="grow" />
        <UButton :disabled="isError" @click="saveAvatarImage"> Save avatar </UButton>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
