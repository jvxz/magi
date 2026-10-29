<script lang="ts" setup>
import type { RoomMember } from 'matrix-js-sdk'
import type { DialogRootProps } from 'reka-ui'

export interface ImageDialogProps extends DialogRootProps {
  alt: string
  blurhash?: string
  type: GlobalDialogMap['image']['type']
  room?: MaybeRoomOrId
  user?: MaybeUserOrId
  member?: RoomMember | string
  url?: string
}

const props = withDefaults(defineProps<ImageDialogProps>(), { modal: true })

const open = defineModel<boolean>('open')

const delegated = reactiveOmit(props, ['alt', 'type', 'room', 'user', 'member'])
const isError = ref(false)
const imageUrl = ref<string>()

const shared = {
  class: 'rounded pointer-events-auto size-full object-cover max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-20rem)] max-h-[calc(100vh-10rem)]',
  imageSize: 'full',
  onError: () => (isError.value = true),
  onUrl: (url: string | undefined) => (imageUrl.value = url),
  square: true,
} as const

const src = useResolveImageUrl(() => props.url, { size: 'full' })
</script>

<template>
  <UDialogRoot v-bind="delegated" v-model:open="open">
    <div v-if="open" class="absolute inset-y-0 right-0 p-4 z-10000000">
      <DialogClose as-child>
        <UButton size="icon">
          <Icon :name="ICON__CLOSE" />
        </UButton>
      </DialogClose>
    </div>

    <UDialogContent
      class="sm:(size-fit max-w-screen) bg-transparent p-0 border-none items-center justify-center pointer-events-none"
    >
      <VisuallyHidden>
        <UDialogHeader>
          <UDialogTitle> {{ alt }} </UDialogTitle>
          <UDialogDescription> {{ alt }} </UDialogDescription>
        </UDialogHeader>
      </VisuallyHidden>

      <Img v-if="type === 'image'" v-bind="shared" :src :alt :blurhash />
      <MatrixRoomAvatar v-else-if="type === 'room' && room" v-bind="shared" :room />
      <MatrixUserAvatar v-else-if="type === 'user' && user" v-bind="shared" :user />
      <MatrixRoomMemberAvatar v-else-if="room && member" v-bind="shared" :room :member />
    </UDialogContent>
  </UDialogRoot>
</template>
