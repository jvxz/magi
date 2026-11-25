<script lang="ts" setup>
import type { PickerEmoji } from '~/components/emoji-picker/root.vue'

import { getEmojiNodeAttrs } from '~/components/emoji-picker/root.vue'

import { injectRoomInstanceContext } from '../instance.vue'

const { inputEditor, room } = injectRoomInstanceContext()

function onPick(emoji: PickerEmoji) {
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
        <UEmojiPickerRoot :room-ids="[room.roomId]" :space-ids="[]" @pick="onPick">
          <UEmojiPickerSearch />
          <UEmojiPickerList />
        </UEmojiPickerRoot>
      </KeepAlive>
    </PopoverContent>
  </PopoverRoot>
</template>
