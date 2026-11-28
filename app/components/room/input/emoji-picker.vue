<script lang="ts" setup>
import { getEmojiNodeAttrs } from '~/components/emoji-picker/root.vue'

import { injectRoomInstanceContext } from '../instance.vue'

const { inputEditor, room, space } = injectRoomInstanceContext()

function onPick(emoji: Emoji) {
  inputEditor.value
    ?.chain()
    .focus()
    .insertContent([
      { attrs: getEmojiNodeAttrs(emoji), type: 'emoji' },
      { text: ' ', type: 'text' },
    ])
    .run()
}
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <UButton variant="ghost-raised" size="icon">
        <Icon :name="ICON__EMOJI" class="size-5" />
      </UButton>
    </PopoverTrigger>

    <PopoverContent as-child>
      <KeepAlive>
        <UEmojiPickerRoot :room-ids="[room.roomId]" :space-ids="space ? [space.roomId] : []" @pick="onPick">
          <UEmojiPickerSearch />
          <UEmojiPickerList />
        </UEmojiPickerRoot>
      </KeepAlive>
    </PopoverContent>
  </PopoverRoot>
</template>
