import { Mention } from '@tiptap/extension-mention'

export const MentionNode = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      via: { default: null },
    }
  },
})
