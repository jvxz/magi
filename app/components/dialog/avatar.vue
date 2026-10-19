<script lang="ts" setup>
import type { RoomMember } from 'matrix-js-sdk'
import type { DialogRootProps } from 'reka-ui'

export type AvatarDialogProps = DialogRootProps & {
  label: string
  type: GlobalDialogMap['avatar']['type']
  room?: MaybeRoomOrId
  user?: MaybeUserOrId
  member?: RoomMember | string
  src?: string
}

const props = withDefaults(defineProps<AvatarDialogProps>(), { modal: true })

const open = defineModel<boolean>('open')

const delegated = reactiveOmit(props, ['label', 'type', 'room', 'user', 'member'])
const isError = ref(false)
const imageUrl = ref<string>()

const shared = {
  class: 'rounded w-full',
  imageSize: 'full',
  onError: () => (isError.value = true),
  onUrl: (url: string | undefined) => (imageUrl.value = url),
  square: true,
} as const

const resolvedId = computed(() => {
  if (props.type === 'image') return props.label
  if (props.type === 'room') return props.room && resolveRoomId(props.room)
  if (props.type === 'user') return props.user && resolveUserId(props.user)
  if (!props.member) return undefined

  return isString(props.member) ? props.member : props.member.userId
})

const saveAvatarImage = () => {
  if (!imageUrl.value) return

  saveAsImage(imageUrl.value, resolvedId.value ? `${resolvedId.value}-avatar` : createGenericFilename())
}
</script>

<template>
  <UDialogRoot v-bind="delegated" v-model:open="open">
    <UDialogContent class="max-h-90%">
      <UDialogHeader>
        <UDialogTitle> {{ label }} </UDialogTitle>
        <VisuallyHidden>
          <UDialogDescription> {{ label }}'s avatar </UDialogDescription>
        </VisuallyHidden>
      </UDialogHeader>

      <Img v-if="type === 'image'" v-bind="shared" :src :alt="label" />
      <MatrixRoomAvatar v-else-if="type === 'room' && room" v-bind="shared" :room />
      <MatrixUserAvatar v-else-if="type === 'user' && user" v-bind="shared" :user />
      <MatrixRoomMemberAvatar v-else-if="room && member" v-bind="shared" :room :member />

      <UDialogFooter>
        <UDialogAnnotation v-if="isError" class="text-danger"> Failed to load avatar </UDialogAnnotation>
        <div class="grow" />
        <UButton :disabled="isError" @click="saveAvatarImage"> Save avatar </UButton>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
