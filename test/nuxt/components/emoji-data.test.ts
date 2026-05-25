import { describe, expect, it, vi } from 'vitest'

const getEmojiData = async () => {
  const emojiData = useEmojiData()
  await vi.waitUntil(() => !emojiData.isLoading.value)
  return emojiData
}

describe('emoji data', () => {
  it('processes categories correctly', async () => {
    const { categories } = await getEmojiData()

    expect(categories.value[0]?.key).toBe('smileys-emotion')
  })

  it('processes grouped emojis correctly', async () => {
    const { groupedEmojis } = await getEmojiData()

    expect(groupedEmojis.value[0]?.[0]?.hexcode).toBe('1F600')
  })
})
